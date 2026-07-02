import { formatDistanceToNow, format } from "date-fns";

export function ago(d) { 
  if (!d) return "Never"; 
  try { return formatDistanceToNow(new Date(d), { addSuffix: true }); } 
  catch { return "—"; } 
}

export function fDate(d) { 
  try { return format(new Date(d), "d MMM yyyy"); } 
  catch { return "—"; } 
}

export function fTime(d) { 
  try { return format(new Date(d), "HH:mm"); } 
  catch { return "—"; } 
}

export function fBytes(b) { 
  if (!b) return ""; 
  if (b < 1024) return b + " B"; 
  if (b < 1048576) return (b / 1024).toFixed(0) + " KB"; 
  return (b / 1048576).toFixed(1) + " MB"; 
}
