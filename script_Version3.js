// Loads hot-takes from hot-takes.txt (one per line) and displays random picks.
// Falls back to embedded sample if fetch fails.

const HOT_TAKES_PATH = './hot-takes.txt';
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
  try{
    const res = await fetch(HOT_TAKES_PATH, {cache: "no-store"});
    if(!res.ok) throw new Error('HTTP ' + res.status);
    const text = await res.text();
    takes = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  }catch(err){
    // fallback sample
    takes = [
      "Pineapple belongs on pizza.",
      "AI will create more interesting art than humans.",
      "Working remotely is more productive than office work.",
      "Billionaires shouldn't exist."
    ];
  }
  samplePreview.textContent = takes.slice(0, 10).join('\n');
  showResults([`Loaded ${takes.length} hot takes. Click Randomize to pick.`]);
}

document.addEventListener('DOMContentLoaded', ()=>{
  loadHotTakes();

  $('randomize').addEventListener('click', ()=>{
    const n = Math.max(1, Math.floor(Number(countInput.value) || 1));
    pickRandom(n);
  });

  $('shuffleAll').addEventListener('click', ()=>{
    showResults(shuffle(takes));
  });
});