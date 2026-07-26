/**
 * Helper module for detecting gig worker employment type, platforms, task types, completed task counts, and rates from speech transcripts.
 */

export const SUPPORTED_PLATFORMS = [
  { id: 'swiggy', name: 'Swiggy', defaultRate: 35, taskType: 'Delivery', color: 'from-orange-500 to-amber-600' },
  { id: 'zomato', name: 'Zomato', defaultRate: 35, taskType: 'Delivery', color: 'from-red-500 to-rose-600' },
  { id: 'blinkit', name: 'Blinkit', defaultRate: 28, taskType: 'Order', color: 'from-yellow-400 to-amber-500' },
  { id: 'zepto', name: 'Zepto', defaultRate: 30, taskType: 'Delivery', color: 'from-purple-500 to-indigo-600' },
  { id: 'uber', name: 'Uber', defaultRate: 120, taskType: 'Ride', color: 'from-slate-700 to-slate-900' },
  { id: 'ola', name: 'Ola', defaultRate: 110, taskType: 'Ride', color: 'from-lime-500 to-emerald-600' },
  { id: 'rapido', name: 'Rapido', defaultRate: 45, taskType: 'Ride', color: 'from-amber-400 to-yellow-500' },
  { id: 'amazon flex', name: 'Amazon Flex', defaultRate: 60, taskType: 'Parcel', color: 'from-amber-500 to-orange-600' },
  { id: 'dunzo', name: 'Dunzo', defaultRate: 35, taskType: 'Pickup', color: 'from-emerald-500 to-teal-600' },
  { id: 'porter', name: 'Porter', defaultRate: 150, taskType: 'Drop', color: 'from-blue-500 to-cyan-600' },
  { id: 'shadowfax', name: 'Shadowfax', defaultRate: 40, taskType: 'Delivery', color: 'from-sky-500 to-blue-600' },
  { id: 'ekart', name: 'Ekart', defaultRate: 50, taskType: 'Parcel', color: 'from-orange-600 to-red-600' },
  { id: 'generic', name: 'Generic Gig Worker', defaultRate: 40, taskType: 'Task', color: 'from-cyan-500 to-blue-600' },
  { id: 'other', name: 'Other', defaultRate: 40, taskType: 'Custom Task', color: 'from-slate-600 to-slate-800' }
];

export const TASK_TYPES = [
  'Delivery',
  'Ride',
  'Parcel',
  'Pickup',
  'Drop',
  'Order',
  'Custom Task'
];

export const GIG_KEYWORDS = [
  'delivery', 'deliveries', 'order', 'orders', 'ride', 'rides', 'trip', 'trips',
  'parcel', 'parcels', 'pickup', 'drop', 'swiggy', 'zomato', 'blinkit', 'zepto',
  'uber', 'ola', 'rapido', 'amazon flex', 'dunzo', 'porter', 'shadowfax', 'ekart',
  'gig', 'per order', 'per delivery', 'per ride', 'per parcel'
];

export const detectGigDetailsFromTranscript = (transcriptText) => {
  if (!transcriptText || typeof transcriptText !== 'string') {
    return { isGig: false, platform: 'Swiggy', taskType: 'Delivery', completedTasks: null, ratePerTask: null, actualPayment: null };
  }

  const text = transcriptText.toLowerCase();

  const isGig = GIG_KEYWORDS.some(kw => text.includes(kw));

  let matchedPlatform = 'Swiggy';
  for (const plat of SUPPORTED_PLATFORMS) {
    if (plat.id !== 'generic' && plat.id !== 'other' && text.includes(plat.id)) {
      matchedPlatform = plat.name;
      break;
    }
  }

  let taskType = 'Delivery';
  if (text.includes('ride') || text.includes('trip') || text.includes('uber') || text.includes('ola') || text.includes('rapido')) {
    taskType = 'Ride';
  } else if (text.includes('parcel') || text.includes('package') || text.includes('amazon')) {
    taskType = 'Parcel';
  } else if (text.includes('pickup')) {
    taskType = 'Pickup';
  } else if (text.includes('drop')) {
    taskType = 'Drop';
  } else if (text.includes('order') || text.includes('blinkit') || text.includes('zepto')) {
    taskType = 'Order';
  }

  // Extract completed task count
  let completedTasks = null;
  const countMatch = text.match(/(\d+)\s*(?:deliveries|delivery|trips|trip|rides|ride|orders|order|parcels|parcel|pickups|drops|tasks|task)/);
  if (countMatch) {
    completedTasks = parseFloat(countMatch[1]);
  }

  // Extract rate per task
  let ratePerTask = null;
  const rateMatch = text.match(/(?:rs\.?|rupees|₹)?\s*(\d+(?:\.\d+)?)\s*(?:per|\/)\s*(?:delivery|ride|order|parcel|trip|task)/)
    || text.match(/at\s*(?:rs\.?|rupees|₹)?\s*(\d+(?:\.\d+)?)/);
  if (rateMatch) {
    ratePerTask = parseFloat(rateMatch[1]);
  }

  // Extract actual payment received
  let actualPayment = null;
  const actualMatch = text.match(/(?:received|paid|got|total paid|net pay)\s*(?:of|is|was)?\s*(?:rs\.?|rupees|₹)?\s*(\d+(?:\.\d+)?)/);
  if (actualMatch) {
    actualPayment = parseFloat(actualMatch[1]);
  }

  return {
    isGig,
    platform: matchedPlatform,
    taskType,
    completedTasks,
    ratePerTask,
    actualPayment
  };
};
