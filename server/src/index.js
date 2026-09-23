import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db.js';
import { analyzeFinances } from './advisor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// --- API ENDPOINTS ---

// Dashboard Overview (Full payload for fast 1-roundtrip rendering)
app.get('/api/dashboard', (req, res) => {
  try {
    const advisorData = analyzeFinances();
    const settings = db.getSettings();
    const recentTransactions = db.getTransactions().slice(0, 15);
    const savingsGoals = db.getSavingsGoals();
    const recurring = db.getRecurring();

    res.json({
      status: 'ok',
      settings,
      advisor: advisorData,
      recentTransactions,
      savingsGoals,
      recurring
    });
  } catch (err) {
    console.error('Error fetching dashboard:', err);
    res.status(500).json({ error: 'Fout bij ophalen dashboard data.' });
  }
});

// Advisor Insights & Forecast
app.get('/api/advisor', (req, res) => {
  try {
    const analysis = analyzeFinances();
    res.json(analysis);
  } catch (err) {
    console.error('Error fetching advisor analysis:', err);
    res.status(500).json({ error: 'Fout bij financieel advies berekening.' });
  }
});

// Transactions CRUD
app.get('/api/transactions', (req, res) => {
  res.json(db.getTransactions());
});

app.post('/api/transactions', (req, res) => {
  try {
    const { amount, type, categoryId, note, date, paymentMethod } = req.body;
    if (!amount || !categoryId) {
      return res.status(400).json({ error: 'Bedrag en categorie zijn verplicht.' });
    }
    const newTx = db.addTransaction({
      amount,
      type: type || 'expense',
      categoryId,
      note,
      date,
      paymentMethod
    });
    res.json(newTx);
  } catch (err) {
    res.status(500).json({ error: 'Fout bij opslaan transactie.' });
  }
});

app.delete('/api/transactions/:id', (req, res) => {
  db.deleteTransaction(req.params.id);
  res.json({ success: true });
});

// Categories CRUD
app.get('/api/categories', (req, res) => {
  res.json(db.getCategories());
});

app.post('/api/categories', (req, res) => {
  const newCat = db.addCategory(req.body);
  res.json(newCat);
});

app.put('/api/categories/:id', (req, res) => {
  const updated = db.updateCategory(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Categorie niet gevonden' });
  res.json(updated);
});

app.delete('/api/categories/:id', (req, res) => {
  db.deleteCategory(req.params.id);
  res.json({ success: true });
});

// Recurring Items
app.get('/api/recurring', (req, res) => {
  res.json(db.getRecurring());
});

app.post('/api/recurring', (req, res) => {
  const item = db.addRecurring(req.body);
  res.json(item);
});

app.put('/api/recurring/:id', (req, res) => {
  const updated = db.updateRecurring(req.params.id, req.body);
  res.json(updated);
});

app.delete('/api/recurring/:id', (req, res) => {
  db.deleteRecurring(req.params.id);
  res.json({ success: true });
});

// Assets & Wealth
app.get('/api/assets', (req, res) => {
  res.json(db.getAssets());
});

app.post('/api/assets', (req, res) => {
  const updated = db.updateAssets(req.body);
  res.json(updated);
});

// Savings Goals
app.get('/api/savings-goals', (req, res) => {
  res.json(db.getSavingsGoals());
});

app.post('/api/savings-goals', (req, res) => {
  const updated = db.updateSavingsGoals(req.body);
  res.json(updated);
});

// Settings & PIN verification
app.get('/api/settings', (req, res) => {
  const settings = db.getSettings();
  // Don't expose plain PIN if not needed, send boolean
  res.json({
    ...settings,
    hasPin: !!settings.pinCode
  });
});

app.post('/api/settings', (req, res) => {
  const updated = db.updateSettings(req.body);
  res.json(updated);
});

app.post('/api/settings/verify-pin', (req, res) => {
  const { pin } = req.body;
  const settings = db.getSettings();
  if (!settings.pinEnabled || !settings.pinCode) {
    return res.json({ valid: true });
  }
  if (settings.pinCode === pin) {
    return res.json({ valid: true });
  }
  return res.status(401).json({ valid: false, error: 'Ongeldige pincode' });
});

// Setup Wizard Complete
app.post('/api/wizard/complete', (req, res) => {
  try {
    const { income, benefits, fixedCosts, savingsGoalMonthly, salaryDay, pinCode } = req.body;
    
    const settings = db.getSettings();
    settings.wizardCompleted = true;
    if (income !== undefined) settings.monthlyNetIncome = Number(income || 0);
    if (benefits !== undefined) settings.mealVoucherMonthly = Number(benefits || 0);
    if (salaryDay !== undefined) settings.salaryDay = Number(salaryDay || 25);
    if (pinCode) {
      settings.pinCode = pinCode;
      settings.pinEnabled = true;
    } else {
      settings.pinCode = '';
      settings.pinEnabled = false;
    }
    db.updateSettings(settings);

    // Update category budgets if specified
    if (income !== undefined) {
      db.updateCategory('inc_salary', { budget: Number(income || 0) });
      const recSalary = db.getRecurring().find(r => r.id === 'rec_salary');
      if (recSalary) db.updateRecurring('rec_salary', { amount: Number(income || 0), dayOfMonth: Number(salaryDay || 25) });
    }
    if (benefits !== undefined) {
      db.updateCategory('inc_meal_vouchers', { budget: Number(benefits || 0) });
      const recMeal = db.getRecurring().find(r => r.id === 'rec_meals');
      if (recMeal) db.updateRecurring('rec_meals', { amount: Number(benefits || 0) });
    }
    if (fixedCosts && typeof fixedCosts === 'object') {
      Object.entries(fixedCosts).forEach(([catId, amount]) => {
        const val = Number(amount || 0);
        db.updateCategory(catId, { budget: val });
        const rec = db.getRecurring().find(r => r.categoryId === catId);
        if (rec) db.updateRecurring(rec.id, { amount: val });
      });
    }

    res.json({ success: true, settings: db.getSettings() });
  } catch (err) {
    console.error('Wizard error:', err);
    res.status(500).json({ error: 'Fout bij voltooien wizard' });
  }
});

// Backup Export & Import
app.get('/api/export', (req, res) => {
  const data = db.get();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=mybudget-backup-${new Date().toISOString().split('T')[0]}.json`);
  res.send(JSON.stringify(data, null, 2));
});

app.post('/api/import', (req, res) => {
  try {
    const importedData = req.body;
    if (!importedData.categories || !importedData.settings) {
      return res.status(400).json({ error: 'Ongeldig backup bestand.' });
    }
    db.save(importedData);
    res.json({ success: true, message: 'Data succesvol hersteld!' });
  } catch (err) {
    res.status(500).json({ error: 'Fout bij importeren data.' });
  }
});

// Reset to factory defaults
app.post('/api/reset', (req, res) => {
  const defaultState = db.get();
  defaultState.transactions = [];
  defaultState.settings.wizardCompleted = false;
  defaultState.settings.pinCode = '';
  defaultState.settings.pinEnabled = false;
  db.save(defaultState);
  res.json({ success: true });
});

// Serve Client Static Build in production
const clientDist = path.join(__dirname, '..', '..', 'client', 'dist');
app.use(express.static(clientDist));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint niet gevonden' });
  }
  const indexPath = path.join(clientDist, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.send(`<h2>MyBudget Backend is actief op poort ${PORT}</h2><p>Draai de client via Vite development server of run 'npm run build' in client.</p>`);
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 MyBudget Server & Adviseur draait op http://0.0.0.0:${PORT}`);
  console.log(`📱 Toegankelijk via je NUC LAN / Tailscale IP: poort ${PORT}`);
});
