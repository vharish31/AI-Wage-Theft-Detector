/**
 * Job Aliases Dictionary & Normalization Utility (Frontend)
 */

export const JOB_ALIASES = {
  "brick layer": "Mason",
  "bricklayer": "Mason",
  "kothanar": "Mason",
  "கொத்தனார்": "Mason",
  "raj mistri": "Mason",
  "rajmistri": "Mason",
  "mistri": "Mason",
  "head mason": "Mason",
  "mason": "Mason",

  "delivery boy": "Delivery Partner",
  "delivery person": "Delivery Partner",
  "delivery agent": "Delivery Partner",
  "swiggy rider": "Delivery Partner",
  "zomato rider": "Delivery Partner",
  "zepto rider": "Delivery Partner",
  "blinkit rider": "Delivery Partner",
  "courier boy": "Delivery Partner",
  "courier rider": "Delivery Partner",
  "delivery partner": "Delivery Partner",
  "gig worker": "Delivery Partner",

  "electric work": "Electrician",
  "electrical worker": "Electrician",
  "wireman": "Electrician",
  "wiring worker": "Electrician",
  "electrician": "Electrician",

  "paint worker": "Painter",
  "house painter": "Painter",
  "wall painter": "Painter",
  "whitewasher": "Painter",
  "painter": "Painter",

  "cab driver": "Driver",
  "auto driver": "Driver",
  "taxi driver": "Driver",
  "car driver": "Driver",
  "truck driver": "Driver",
  "driver": "Driver",

  "agricultural worker": "Farm Worker",
  "field worker": "Farm Worker",
  "farm hand": "Farm Worker",
  "farmer": "Farm Worker",
  "farm worker": "Farm Worker",

  "house maid": "Domestic Worker",
  "maid": "Domestic Worker",
  "housekeeper": "Domestic Worker",
  "domestic maid": "Domestic Worker",
  "cook": "Domestic Worker",
  "domestic worker": "Domestic Worker",

  "welding worker": "Welder",
  "welder": "Welder",

  "security": "Security Guard",
  "guard": "Security Guard",
  "watchman": "Security Guard",
  "gatekeeper": "Security Guard",
  "security guard": "Security Guard",

  "plumbing worker": "Plumber",
  "pipe fitter": "Plumber",
  "plumber": "Plumber",

  "woodworker": "Carpenter",
  "furniture maker": "Carpenter",
  "carpentry worker": "Carpenter",
  "carpenter": "Carpenter",

  "site worker": "Construction Worker",
  "laborer": "Construction Worker",
  "labourer": "Construction Worker",
  "construction laborer": "Construction Worker",
  "construction worker": "Construction Worker",
  "helper": "Construction Worker",
  "coolie": "Construction Worker",

  "sanitation worker": "Sanitation Worker",
  "sweeper": "Sanitation Worker",
  "garbage collector": "Sanitation Worker",
  "cleaner": "Sanitation Worker",

  "factory worker": "Factory Worker",
  "assembly worker": "Factory Worker",
  "mill worker": "Factory Worker"
};

export const CANONICAL_JOB_LIST = [
  "Construction Worker",
  "Mason",
  "Carpenter",
  "Painter",
  "Electrician",
  "Plumber",
  "Driver",
  "Delivery Partner",
  "Farm Worker",
  "Domestic Worker",
  "Welder",
  "Security Guard",
  "Sanitation Worker",
  "Factory Worker"
];

export const normalizeJobType = (jobName) => {
  if (!jobName || !String(jobName).trim()) return "Construction Worker";
  const cleaned = String(jobName).trim().lowerCase ? String(jobName).trim().toLowerCase() : String(jobName).trim();
  
  if (JOB_ALIASES[cleaned]) {
    return JOB_ALIASES[cleaned];
  }

  for (const [alias, canonical] of Object.entries(JOB_ALIASES)) {
    if (alias.includes(cleaned) || cleaned.includes(alias)) {
      return canonical;
    }
  }

  for (const canonical of CANONICAL_JOB_LIST) {
    if (canonical.toLowerCase() === cleaned) {
      return canonical;
    }
  }

  return String(jobName).trim().replace(/\b\w/g, l => l.toUpperCase());
};

const STATUTORY_BENCHMARKS = {
  'Construction Worker': { rate: 850, category: 'Unskilled / Semi-skilled', act: 'Tamil Nadu Minimum Wages Act - Building and Construction' },
  'Mason': { rate: 950, category: 'Skilled', act: 'Building and Other Construction Workers Act' },
  'Carpenter': { rate: 920, category: 'Skilled', act: 'Tamil Nadu Minimum Wages Act' },
  'Painter': { rate: 900, category: 'Skilled', act: 'Tamil Nadu Minimum Wages Act' },
  'Electrician': { rate: 950, category: 'Highly Skilled', act: 'Tamil Nadu Electrical Trades Wage Revision' },
  'Plumber': { rate: 910, category: 'Skilled', act: 'Tamil Nadu Minimum Wages Notification' },
  'Driver': { rate: 880, category: 'Skilled', act: 'Tamil Nadu Motor Transport Workers Rules' },
  'Delivery Partner': { rate: 700, category: 'Gig Worker / Semi-skilled', act: 'Tamil Nadu Shops and Establishments Act' },
  'Farm Worker': { rate: 620, category: 'Unskilled', act: 'Tamil Nadu Agricultural Workers Wages Act' },
  'Domestic Worker': { rate: 650, category: 'Unskilled', act: 'Tamil Nadu Unorganized Workers Act' },
  'Welder': { rate: 960, category: 'Highly Skilled', act: 'Tamil Nadu Engineering & Industrial Trades Gazette' },
  'Security Guard': { rate: 750, category: 'Semi-skilled', act: 'Tamil Nadu Private Security Agencies Rules' },
  'Sanitation Worker': { rate: 720, category: 'Unskilled', act: 'Municipal Corporation Minimum Wage Standards' },
  'Factory Worker': { rate: 780, category: 'Semi-skilled', act: 'Factories Act Minimum Wage Notification' }
};

export const getJobCategoryInfo = (jobName, location = 'Chennai') => {
  const normalized = normalizeJobType(jobName);
  const info = STATUTORY_BENCHMARKS[normalized] || {
    rate: 800,
    category: 'Statutory Benchmark Rate',
    act: 'State Minimum Wages Notification'
  };

  const stateName = location.toLowerCase().includes('mumbai') ? 'Maharashtra' :
                    location.toLowerCase().includes('bengaluru') || location.toLowerCase().includes('bangalore') ? 'Karnataka' :
                    location.toLowerCase().includes('delhi') ? 'Delhi NCT' :
                    location.toLowerCase().includes('kolkata') ? 'West Bengal' : 'Tamil Nadu';

  return {
    rawJobType: jobName,
    jobType: normalized,
    location,
    state: stateName,
    category: info.category,
    wageCategory: `${stateName} ${info.category} ${normalized}`,
    expectedDailyWage: info.rate,
    expectedHourlyWage: Math.round((info.rate / 8) * 100) / 100,
    legalActRef: info.act
  };
};
