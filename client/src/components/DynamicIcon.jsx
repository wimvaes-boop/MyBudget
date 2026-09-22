import React from 'react';
import * as Icons from 'lucide-react';

export default function DynamicIcon({ name, className = "w-5 h-5", color, style }) {
  const IconComponent = Icons[name] || Icons.CircleDot;
  return <IconComponent className={className} color={color} style={style} />;
}
