// Loads hot-takes and displays random picks with category selection.
// Supports Filipino and International questions.

const STORAGE_KEY = 'hotTakesData';
let currentCategory = 'filipino';
let allTakes = {
  filipino: [],
  international: []
};
let takes = [];

const $ = (id) => document.getElementById(id);
const countInput = $('count');
const out = $('output');
const samplePreview = $('samplePreview');

function shuffle(arr){
  // Fisher-Yates
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

function showResults(list){
  if(!list || list.length===0){
    out.innerHTML = '<em>No hot takes found. Add lines to hot-takes.txt.</em>';
    return;
  }
  out.innerHTML = '';
  list.forEach(t => {
    const div = document.createElement('div');
    div.className = 'hot-take';
    div.textContent = t;
    out.appendChild(div);
  });
}

function pickRandom(n){
  const picked = shuffle(takes).slice(0, Math.min(n, takes.length));
  showResults(picked);
}

async function loadHotTakes(){
  // Try to load from localStorage first
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      allTakes = JSON.parse(stored);
      updateCategory(currentCategory);
      return;
    }
  } catch (err) {
    console.error('Error loading from storage:', err);
  }

  // Load default Filipino questions
  allTakes.filipino = [
    "Raisins in menudo yes or no?",
    "Papaya or sayote in tinola?",
    "Chicken Adobo vs. Pork Adobo: Which is the superior Adobo?",
    "Jollibee or McDonald's?",
    "Pineapple on pizza: Acceptable or unacceptable?",
    "Banana ketchup or tomato ketchup?",
    "Sisig: Crispy or saucy?",
    "Lechon: Cebu style or Manila style?",
    "Pusit or isda sa sinigang?",
    "Tuyo: Breakfast staple or no?",
    "Rice: Every meal or just lunch/dinner?",
    "Balut: Delicacy or hard pass?",
    "Pancit Canton: Extra hot or original?",
    "Ketchup on spaghetti: Yes or no?",
    "Filipinos are the best singers in the world.",
    "Manila traffic is worse than any other city.",
    "The Philippines should have stayed under Spanish rule longer.",
    "English-only education is better for Filipino students.",
    "OFWs are modern-day heroes or victims of poor government policy?",
    "Jejemon culture was actually creative and fun."
  ];

  // Load International questions
  allTakes.international = [
    "Pineapple belongs on pizza.",
    "AI will create more interesting art than humans.",
    "Working remotely is more productive than office work.",
    "Billionaires shouldn't exist.",
    "The book is always better than the movie.",
    "Gifs: Pronounced 'Gif' (hard G) or 'Jif'?",
    "Iced or hot coffee?",
    "Dark Mode: If you use Light Mode, you are a psychopath.",
    "Friends (TV Show): It wasn't actually that funny.",
    "Straws: Does a straw have one hole or two?",
    "Tabs vs. Spaces: Tabs are objectively superior.",
    "Star Wars prequels are better than the originals.",
    "Cryptocurrency is the future of money.",
    "Social media has done more harm than good.",
    "Climate change is the most important issue of our time.",
    "Video games are a waste of time.",
    "Reality TV is high art.",
    "Morning people are just pretending to be happy.",
    "Dogs are better than cats (or vice versa).",
    "Cancel culture is necessary for accountability."
  ];

  // Set initial category
  updateCategory(currentCategory);
}

function updateCategory(category){
  currentCategory = category;
  takes = allTakes[category];
  samplePreview.textContent = takes.slice(0, 10).join('\n');
  showResults([`Loaded ${takes.length} ${category} hot takes. Click Randomize to pick.`]);
}

document.addEventListener('DOMContentLoaded', ()=>{
  loadHotTakes();

  // Category selection
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      updateCategory(e.target.dataset.category);
    });
  });

  $('randomize').addEventListener('click', ()=>{
    const n = Math.max(1, Math.floor(Number(countInput.value) || 1));
    pickRandom(n);
  });

  $('shuffleAll').addEventListener('click', ()=>{
    showResults(shuffle(takes));
  });
});