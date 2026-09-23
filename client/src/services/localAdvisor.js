/**
 * In-browser Advisor Engine for Standalone / GitHub Pages mode.
 * Identical financial calculations, velocity checks, and insights to the backend advisor.
 */

export function analyzeFinancesLocally(state) {
  const settings = state.settings || {};
  const categories = state.categories || [];
  const transactions = state.transactions || [];
  const recurring = state.recurring || [];
  const assets = state.assets || [];
  const savingsGoals = state.savings_goals || [];

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11
  const currentDay = now.getDate();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  const monthProgressPct = Math.round((currentDay / daysInMonth) * 100);

  // Salary countdown
  let salaryDay = settings.salaryDay || 25;
  let daysUntilSalary = 0;
  if (currentDay <= salaryDay) {
    daysUntilSalary = salaryDay - currentDay;
  } else {
    daysUntilSalary = (daysInMonth - currentDay) + salaryDay;
  }
  if (daysUntilSalary === 0) daysUntilSalary = 1;

  // Current month's transactions
  const monthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  const categorySpending = {};
  const categoryIncome = {};

  categories.forEach(c => {
    categorySpending[c.id] = 0;
    categoryIncome[c.id] = 0;
  });

  let totalActualExpenses = 0;
  let totalActualIncome = 0;

  monthTransactions.forEach(t => {
    const amt = Number(t.amount) || 0;
    if (t.type === 'expense') {
      categorySpending[t.categoryId] = (categorySpending[t.categoryId] || 0) + amt;
      totalActualExpenses += amt;
    } else if (t.type === 'income') {
      categoryIncome[t.categoryId] = (categoryIncome[t.categoryId] || 0) + amt;
      totalActualIncome += amt;
    }
  });

  const totalBudgetedIncome = categories
    .filter(c => c.type === 'income')
    .reduce((sum, c) => sum + (Number(c.budget) || 0), 0) || Number(settings?.monthlyNetIncome) || 0;

  const totalBudgetedExpenses = categories
    .filter(c => c.type === 'expense')
    .reduce((sum, c) => sum + (Number(c.budget) || 0), 0);

  const needsBudget = categories
    .filter(c => c.type === 'expense' && c.group === 'needs')
    .reduce((sum, c) => sum + (Number(c.budget) || 0), 0);

  const wantsBudget = categories
    .filter(c => c.type === 'expense' && c.group === 'wants')
    .reduce((sum, c) => sum + (Number(c.budget) || 0), 0);

  const savingsBudget = categories
    .filter(c => c.type === 'expense' && c.group === 'savings')
    .reduce((sum, c) => sum + (Number(c.budget) || 0), 0);

  let actualNeeds = 0;
  let actualWants = 0;
  let actualSavings = 0;

  categories.forEach(c => {
    const spent = categorySpending[c.id] || 0;
    if (c.group === 'needs') actualNeeds += spent;
    else if (c.group === 'wants') actualWants += spent;
    else if (c.group === 'savings') actualSavings += spent;
  });

  // Effective income considered: base salary + extra creative/freelance income
  const actualSalaryIncome = (categoryIncome['inc_salary'] || 0) + (categoryIncome['inc_meal_vouchers'] || 0);
  const actualExtraIncome = Math.max(0, totalActualIncome - actualSalaryIncome);
  const effectiveMonthlyIncome = Math.max(actualSalaryIncome, totalBudgetedIncome) + actualExtraIncome;

  const rule50_30_20 = {
    needs: {
      idealPct: 50,
      idealAmount: Math.round(effectiveMonthlyIncome * 0.50),
      budgetedAmount: needsBudget,
      actualAmount: actualNeeds,
      actualPct: effectiveMonthlyIncome > 0 ? Math.round((actualNeeds / effectiveMonthlyIncome) * 100) : 0,
      status: actualNeeds > (effectiveMonthlyIncome * 0.55) ? 'warning' : 'ok'
    },
    wants: {
      idealPct: 30,
      idealAmount: Math.round(effectiveMonthlyIncome * 0.30),
      budgetedAmount: wantsBudget,
      actualAmount: actualWants,
      actualPct: effectiveMonthlyIncome > 0 ? Math.round((actualWants / effectiveMonthlyIncome) * 100) : 0,
      status: actualWants > (effectiveMonthlyIncome * 0.35) ? 'warning' : 'ok'
    },
    savings: {
      idealPct: 20,
      idealAmount: Math.round(effectiveMonthlyIncome * 0.20),
      budgetedAmount: savingsBudget,
      actualAmount: actualSavings,
      actualPct: effectiveMonthlyIncome > 0 ? Math.round((actualSavings / effectiveMonthlyIncome) * 100) : 0,
      status: actualSavings >= (effectiveMonthlyIncome * 0.18) ? 'ok' : 'low'
    }
  };

  const totalVariableBudget = wantsBudget + (categories.find(c => c.id === 'exp_groceries')?.budget || 400);
  const totalVariableSpent = actualWants + (categorySpending['exp_groceries'] || 0);
  const remainingVariableBudget = Math.max(0, totalVariableBudget - totalVariableSpent);
  
  const dailySafeToSpend = Math.max(0, Math.round((remainingVariableBudget / Math.max(1, daysUntilSalary)) * 10) / 10);

  const totalLiquidAssets = assets
    .filter(a => a.category === 'savings')
    .reduce((sum, a) => sum + (Number(a.value) || 0), 0);

  const totalInvestedAssets = assets
    .filter(a => a.category === 'investments' || a.category === 'pension' || a.category === 'crypto')
    .reduce((sum, a) => sum + (Number(a.value) || 0), 0);

  const totalNetWorth = assets.reduce((sum, a) => sum + (Number(a.value) || 0), 0);

  const monthlyFixedCost = needsBudget > 0 ? needsBudget : 1500;
  const emergencyFundCoverageMonths = Math.round((totalLiquidAssets / Math.max(1, monthlyFixedCost)) * 10) / 10;
  const targetBuffer = (settings.emergencyFundTargetMonths || 6) * monthlyFixedCost;

  const insights = [];
  const categoryAlerts = [];

  // Check category velocity
  categories.filter(c => c.type === 'expense' && c.budget > 0).forEach(c => {
    const spent = categorySpending[c.id] || 0;
    const spentPct = Math.round((spent / c.budget) * 100);
    const expectedSpendAtThisPoint = (c.budget * (monthProgressPct / 100));

    let alertLevel = 'normal';
    let alertMessage = null;

    if (c.isFixed) {
      if (spent > c.budget + 2) {
        alertLevel = 'danger';
        alertMessage = `Vaste last overschreden (€${spent.toFixed(0)} ipv €${c.budget.toFixed(0)})`;
        categoryAlerts.push({
          categoryId: c.id,
          categoryName: c.name,
          level: 'danger',
          message: `Vaste kost ${c.name} is hoger uitgevallen dan gepland (€${spent.toFixed(0)} / €${c.budget.toFixed(0)}).`,
          spent,
          budget: c.budget,
          pct: spentPct
        });
      } else if (spent >= c.budget) {
        alertLevel = 'normal';
        alertMessage = `Vaste last voldaan`;
      }
    } else {
      if (spent >= c.budget) {
        alertLevel = 'danger';
        alertMessage = `Budget 100% verbruikt (€${spent.toFixed(0)} van €${c.budget})`;
        categoryAlerts.push({
          categoryId: c.id,
          categoryName: c.name,
          level: 'danger',
          message: `Je hebt het volledige budget voor ${c.name} bereikt (€${spent.toFixed(0)} / €${c.budget}).`,
          spent,
          budget: c.budget,
          pct: spentPct
        });
      } else if (spent > expectedSpendAtThisPoint * 1.35 && monthProgressPct > 15) {
        alertLevel = 'caution';
        alertMessage = `Loopt sneller leeg (${spentPct}% op ${monthProgressPct}% van de maand)`;
        categoryAlerts.push({
          categoryId: c.id,
          categoryName: c.name,
          level: 'caution',
          message: `${c.name} ligt voor op schema (${spentPct}% verbruikt terwijl we pas op dag ${currentDay} zitten).`,
          spent,
          budget: c.budget,
          pct: spentPct
        });
      }
    }

    c.currentMonthSpent = spent;
    c.spentPct = spentPct;
    c.alertLevel = alertLevel;
    c.alertMessage = alertMessage;
  });

  let healthScore = 75;
  if (emergencyFundCoverageMonths >= 3) healthScore += 10;
  if (emergencyFundCoverageMonths >= 6) healthScore += 5;
  if (rule50_30_20.savings.actualPct >= 20 || savingsBudget >= (effectiveMonthlyIncome * 0.2)) healthScore += 10;
  if (categoryAlerts.some(a => a.level === 'danger')) healthScore -= 12;
  if (categoryAlerts.filter(a => a.level === 'caution').length >= 2) healthScore -= 8;
  healthScore = Math.max(25, Math.min(98, healthScore));

  if (actualExtraIncome > 0) {
    insights.push({
      id: 'variable_income_boost',
      type: 'tip',
      badge: 'Extra Inkomsten',
      title: `+ € ${actualExtraIncome.toFixed(0)} aan extra inkomsten!`,
      description: `Mooi resultaat! Je hebt deze maand al € ${actualExtraIncome.toFixed(0)} aan extra inkomsten geregistreerd (zoals verkoop van tekeningen, opdrachten of workshops). Dit vergroot direct je bestedingsruimte en spaarcapaciteit.`,
      icon: 'Palette',
      color: 'emerald'
    });
  }

  if (dailySafeToSpend > 0) {
    insights.push({
      id: 'daily_allowance',
      type: 'tip',
      badge: 'Vrij Besteedbaar',
      title: `Veilig dagbudget: € ${dailySafeToSpend.toFixed(0)} / dag`,
      description: `Met nog ${daysUntilSalary} dagen tot je volgende salaris kun je dagelijks ca. € ${dailySafeToSpend.toFixed(0)} uitgeven aan variabele wensen om perfect op schema te blijven.`,
      icon: 'Calendar',
      color: 'emerald'
    });
  }

  if (categoryAlerts.length > 0) {
    const danger = categoryAlerts.find(a => a.level === 'danger');
    if (danger) {
      insights.push({
        id: 'category_exceeded',
        type: 'warning',
        badge: 'Budgetoverschrijding',
        title: `Rem af op ${danger.categoryName}`,
        description: danger.message,
        icon: 'AlertTriangle',
        color: 'rose'
      });
    } else {
      const caution = categoryAlerts[0];
      insights.push({
        id: 'category_speed',
        type: 'caution',
        badge: 'Burn-rate Alert',
        title: `Let op je tempo bij ${caution.categoryName}`,
        description: caution.message,
        icon: 'TrendingUp',
        color: 'amber'
      });
    }
  }

  return {
    month: {
      year: currentYear,
      monthIndex: currentMonth,
      currentDay,
      daysInMonth,
      daysUntilSalary,
      monthProgressPct
    },
    summary: {
      effectiveIncome: effectiveMonthlyIncome,
      actualIncome: totalActualIncome,
      actualExpenses: totalActualExpenses,
      netSavingsCurrentMonth: totalActualIncome - totalActualExpenses,
      budgetedIncome: totalBudgetedIncome,
      budgetedExpenses: totalBudgetedExpenses,
      dailySafeToSpend,
      healthScore,
      totalNetWorth,
      totalLiquidAssets,
      totalInvestedAssets,
      emergencyFundCoverageMonths,
      targetBuffer
    },
    rule50_30_20,
    categoryAlerts,
    insights,
    categoriesWithStats: categories.map(c => ({
      ...c,
      spent: categorySpending[c.id] || 0,
      received: categoryIncome[c.id] || 0,
      pct: c.budget > 0 ? Math.min(150, Math.round(((categorySpending[c.id] || 0) / c.budget) * 100)) : 0
    }))
  };
}
