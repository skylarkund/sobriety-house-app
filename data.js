const DEFAULT_SPECIAL_DATES = {
  oliviaBirthday: '12-22',
  everlyBirthday: '06-22',
  dadBirthday: '01-22'
};

const ROOM_COORDS = {
  'Bedroom': [
    [17,21],[25,26],[33,20],[19,35],[31,37],[12,31],[39,30],[24,15]
  ],
  'Living Room': [
    [63,20],[74,25],[84,20],[67,37],[80,38],[91,32],[73,15],[60,31]
  ],
  'Kitchen': [
    [17,61],[28,66],[39,61],[20,78],[35,79],[11,71],[44,73],[29,55]
  ],
  'Office': [
    [62,62],[73,67],[84,62],[67,80],[80,80],[91,72],[74,55]
  ],
  'Entry': [
    [49,45],[55,49],[46,64],[54,67],[50,79],[43,53],[57,58]
  ],
  'Yard': [
    [12,88],[23,91],[36,88],[50,91],[64,88],[78,91],[90,86],[84,78],[68,78],[18,78]
  ]
};

const MONTHLY_MILESTONES = [
  { day: 30, name: 'Living Room Complete', room: 'Living Room', icon: '🛋️', text: 'Month 1 milestone: the living room feels lived in.' },
  { day: 60, name: 'Kitchen Complete', room: 'Kitchen', icon: '🍽️', text: 'Month 2 milestone: the kitchen is ready for family meals.' },
  { day: 90, name: 'Backyard Play Area', room: 'Yard', icon: '🛝', text: 'Month 3 milestone: the yard becomes a place for memories.' },
  { day: 120, name: 'Bedroom Complete', room: 'Bedroom', icon: '🛏️', text: 'Month 4 milestone: rest has a peaceful place.' },
  { day: 150, name: 'Home Office Complete', room: 'Office', icon: '💼', text: 'Month 5 milestone: leadership has a grounded space.' },
  { day: 180, name: 'Patio Fire Pit', room: 'Yard', icon: '🔥', text: 'Month 6 milestone: the outside becomes peaceful too.' },
  { day: 210, name: 'Family Gallery Wall', room: 'Living Room', icon: '🖼️', text: 'Month 7 milestone: memories become part of the walls.' },
  { day: 240, name: 'Garden Beds', room: 'Yard', icon: '🌷', text: 'Month 8 milestone: the home grows outside too.' },
  { day: 270, name: 'Bikes by the Garage', room: 'Yard', icon: '🚲', text: 'Month 9 milestone: weekend adventures are waiting.' },
  { day: 300, name: 'Reading Nook', room: 'Living Room', icon: '📖', text: 'Month 10 milestone: quiet has a corner.' },
  { day: 330, name: 'Finished Porch', room: 'Entry', icon: '🏡', text: 'Month 11 milestone: the entrance feels proud.' },
  { day: 365, name: 'One Year Home Makeover', room: 'Yard', icon: '🏆', text: 'One year: the home glows with everything that was rebuilt.' },
  { day: 730, name: 'Two Year Legacy Tree', room: 'Yard', icon: '🌳', text: 'Two years: roots deep enough to give shade.' },
  { day: 1095, name: 'Three Year Memory Garden', room: 'Yard', icon: '🌻', text: 'Three years: the home is full of steady life.' },
  { day: 1825, name: 'Five Year Legacy Porch', room: 'Entry', icon: '✨', text: 'Five years: the house tells a story of consistency.' }
];

const DAILY_POOL = [
  { name:'Porch Light', room:'Entry', icon:'🏮', text:'A light turns on so home feels open again.' },
  { name:'Welcome Mat', room:'Entry', icon:'♡', text:'A small reminder that every day starts at the door.' },
  { name:'Front Steps', room:'Entry', icon:'▤', text:'One steady step at a time.' },
  { name:'Bedroom Pillow', room:'Bedroom', icon:'🛏️', text:'Rest becomes part of the rebuild.' },
  { name:'Bed Blanket', room:'Bedroom', icon:'🛌', text:'A warmer place to land at the end of the day.' },
  { name:'Nightstand', room:'Bedroom', icon:'▣', text:'The little things begin to have a place.' },
  { name:'Alarm Clock', room:'Bedroom', icon:'⏰', text:'A new rhythm starts to hold.' },
  { name:'Olivia and Everly Drawing', room:'Kitchen', icon:'🎨', text:'Signs of his daughters are always part of the home.' },
  { name:'Coffee Mug', room:'Kitchen', icon:'☕', text:'A simple morning ritual.' },
  { name:'Kitchen Towel', room:'Kitchen', icon:'▥', text:'Care shows up in ordinary details.' },
  { name:'Living Room Rug', room:'Living Room', icon:'▭', text:'The room starts feeling softer.' },
  { name:'Couch Pillow', room:'Living Room', icon:'🟫', text:'Comfort is earned one choice at a time.' },
  { name:'Family Photo Frame', room:'Living Room', icon:'🖼️', text:'A reminder of who this home is for.' },
  { name:'Small Bookshelf', room:'Living Room', icon:'📚', text:'Stories return to the shelves.' },
  { name:'Bathroom Soap', room:'Bedroom', icon:'🧴', text:'Self-care gets rebuilt too.' },
  { name:'Laundry Basket', room:'Bedroom', icon:'🧺', text:'Order returns in small ways.' },
  { name:'Fruit Bowl', room:'Kitchen', icon:'🍎', text:'The kitchen starts to support health.' },
  { name:'Dining Chair', room:'Kitchen', icon:'🪑', text:'A place is set.' },
  { name:'Homework Paper', room:'Kitchen', icon:'📄', text:'The girls are present in the everyday mess.' },
  { name:'Hallway Shoes', room:'Entry', icon:'👟', text:'Little signs that life is happening here.' },
  { name:'Porch Plant', room:'Entry', icon:'🪴', text:'Growth starts at the entrance.' },
  { name:'Front Door Wreath', room:'Entry', icon:'○', text:'The outside begins to look cared for.' },
  { name:'Living Room Lamp', room:'Living Room', icon:'💡', text:'A little warmth in the room.' },
  { name:'Throw Blanket', room:'Living Room', icon:'▧', text:'Comfort becomes visible.' },
  { name:'Backpack Hook', room:'Entry', icon:'🎒', text:'A place for what matters.' },
  { name:'Kitchen Calendar', room:'Kitchen', icon:'📅', text:'The days are being counted with purpose.' },
  { name:'Hopscotch Chalk', room:'Yard', icon:'#', text:'Play belongs in the yard again.' },
  { name:'Mailbox', room:'Yard', icon:'📮', text:'The home begins to connect to the world.' },
  { name:'Window Curtains', room:'Bedroom', icon:'▥', text:'Morning light comes in softer now.' },
  { name:'Dad’s Work Notebook', room:'Office', icon:'📓', text:'Leadership begins with leading yourself.' },
  { name:'Desk Lamp', room:'Office', icon:'💡', text:'Purpose gets a light of its own.' },
  { name:'School Lunchbox', room:'Kitchen', icon:'🍱', text:'The ordinary routines are part of the reward.' },
  { name:'Two Tiny Jackets', room:'Entry', icon:'🧥', text:'Little details show who this home protects.' },
  { name:'Garden Flower', room:'Yard', icon:'🌼', text:'Progress blooms in small places.' },
  { name:'Porch Rail Planter', room:'Entry', icon:'🌿', text:'The front of the house gets warmer.' },
  { name:'Family Game Box', room:'Living Room', icon:'🎲', text:'Connection has a place to sit.' },
  { name:'Soccer Ball', room:'Yard', icon:'⚽', text:'The yard is ready for laughter.' },
  { name:'Growth Chart Marks', room:'Entry', icon:'📏', text:'The girls are growing while the home grows too.' },
  { name:'Clean Dishes', room:'Kitchen', icon:'🍽️', text:'Stability shows up in simple routines.' },
  { name:'Bedside Book', room:'Bedroom', icon:'📘', text:'Peace becomes part of the evening.' },
  { name:'Office Chair', room:'Office', icon:'🪑', text:'A steady seat for steady decisions.' },
  { name:'Backyard Lights', room:'Yard', icon:'✨', text:'The outside starts glowing too.' },
  { name:'Daughter Birthday Card', room:'Living Room', icon:'💌', text:'Love leaves evidence around the room.' },
  { name:'Kitchen Plant', room:'Kitchen', icon:'🪴', text:'The kitchen is alive with care.' },
  { name:'Porch Swing Cushion', room:'Entry', icon:'🟨', text:'A place to pause before coming inside.' }
];

function getMilestoneForDay(day) {
  return MONTHLY_MILESTONES.find(m => m.day === day) || null;
}

function getUnlockForDay(day) {
  const milestone = getMilestoneForDay(day);
  if (milestone) return { ...milestone, day, type: 'milestone' };
  const item = DAILY_POOL[(day - 1) % DAILY_POOL.length];
  const cycle = Math.floor((day - 1) / DAILY_POOL.length);
  return {
    ...item,
    day,
    type: 'daily',
    name: cycle === 0 ? item.name : `${item.name} Upgrade ${cycle + 1}`,
    text: cycle === 0 ? item.text : 'A familiar part of home gets a little more complete.'
  };
}

function getUnlockedItems(day) {
  const maxDay = Math.min(Math.max(1, day), 1825);
  const items = [];
  for (let d = 1; d <= maxDay; d++) items.push(getUnlockForDay(d));
  return items;
}

function getNextMilestone(day) {
  return MONTHLY_MILESTONES.find(m => m.day > day) || MONTHLY_MILESTONES[MONTHLY_MILESTONES.length - 1];
}
