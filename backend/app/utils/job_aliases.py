"""
Job Aliases Dictionary & Mapping for Job Type Standardization Layer.
Maps vernacular terms, regional trade names, slang, and gig platform titles to standard canonical job roles.
"""

JOB_ALIASES = {
    # Mason / Construction Trade Aliases
    "brick layer": "Mason",
    "bricklayer": "Mason",
    "kothanar": "Mason",
    "கொத்தனார்": "Mason",
    "raj mistri": "Mason",
    "rajmistri": "Mason",
    "mistri": "Mason",
    "head mason": "Mason",
    "mason": "Mason",

    # Delivery Partner / Gig Worker Aliases
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

    # Electrician Aliases
    "electric work": "Electrician",
    "electrical worker": "Electrician",
    "wireman": "Electrician",
    "wiring worker": "Electrician",
    "electrician": "Electrician",

    # Painter Aliases
    "paint worker": "Painter",
    "house painter": "Painter",
    "wall painter": "Painter",
    "whitewasher": "Painter",
    "painter": "Painter",

    # Driver Aliases
    "cab driver": "Driver",
    "auto driver": "Driver",
    "taxi driver": "Driver",
    "car driver": "Driver",
    "truck driver": "Driver",
    "driver": "Driver",

    # Farm Worker Aliases
    "agricultural worker": "Farm Worker",
    "field worker": "Farm Worker",
    "farm hand": "Farm Worker",
    "farmer": "Farm Worker",
    "farm worker": "Farm Worker",

    # Domestic Worker Aliases
    "house maid": "Domestic Worker",
    "maid": "Domestic Worker",
    "housekeeper": "Domestic Worker",
    "domestic maid": "Domestic Worker",
    "cook": "Domestic Worker",
    "domestic worker": "Domestic Worker",

    # Welder Aliases
    "welding worker": "Welder",
    "welder": "Welder",

    # Security Guard Aliases
    "security": "Security Guard",
    "guard": "Security Guard",
    "watchman": "Security Guard",
    "gatekeeper": "Security Guard",
    "security guard": "Security Guard",

    # Plumber Aliases
    "plumbing worker": "Plumber",
    "pipe fitter": "Plumber",
    "plumber": "Plumber",

    # Carpenter Aliases
    "woodworker": "Carpenter",
    "furniture maker": "Carpenter",
    "carpentry worker": "Carpenter",
    "carpenter": "Carpenter",

    # General Construction Worker Aliases
    "site worker": "Construction Worker",
    "laborer": "Construction Worker",
    "labourer": "Construction Worker",
    "construction laborer": "Construction Worker",
    "construction worker": "Construction Worker",
    "helper": "Construction Worker",
    "coolie": "Construction Worker",

    # Sanitation Worker Aliases
    "sanitation worker": "Sanitation Worker",
    "sweeper": "Sanitation Worker",
    "garbage collector": "Sanitation Worker",
    "cleaner": "Sanitation Worker",

    # Factory Worker Aliases
    "factory worker": "Factory Worker",
    "assembly worker": "Factory Worker",
    "mill worker": "Factory Worker"
}

CANONICAL_JOB_TYPES = [
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
]
