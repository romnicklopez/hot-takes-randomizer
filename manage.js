// Management page for hot takes - add, edit, delete questions

const STORAGE_KEY = 'hotTakesData';
let currentCategory = 'filipino';
let allTakes = {
  filipino: [],
  international: []
};

const $ = (id) => document.getElementById(id);
const newQuestionInput = $('newQuestion');
const questionList = $('questionList');
const questionCount = $('questionCount');

// Default questions
const defaultTakes = {
  filipino: [
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
  ],
  international: [
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
  ]
};

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      allTakes = JSON.parse(stored);
    } else {
      allTakes = JSON.parse(JSON.stringify(defaultTakes));
      saveData();
    }
  } catch (err) {
    console.error('Error loading data:', err);
    allTakes = JSON.parse(JSON.stringify(defaultTakes));
  }
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allTakes));
  } catch (err) {
    console.error('Error saving data:', err);
    alert('Failed to save data. Storage might be full.');
  }
}

function renderList() {
  const questions = allTakes[currentCategory];
  questionList.innerHTML = '';
  questionCount.textContent = questions.length;

  questions.forEach((q, index) => {
    const li = document.createElement('li');
    li.className = 'question-item';
    li.innerHTML = `
      <span class="question-text">${escapeHtml(q)}</span>
      <input type="text" class="edit-input" value="${escapeHtml(q)}" />
      <div class="item-actions">
        <button class="icon-btn edit-btn" data-index="${index}">✏️</button>
        <button class="icon-btn delete delete-btn" data-index="${index}">🗑️</button>
      </div>
    `;
    questionList.appendChild(li);
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function addQuestion() {
  const text = newQuestionInput.value.trim();
  if (!text) {
    alert('Please enter a question.');
    return;
  }
  
  allTakes[currentCategory].push(text);
  saveData();
  renderList();
  newQuestionInput.value = '';
  newQuestionInput.focus();
}

function deleteQuestion(index) {
  if (!confirm('Are you sure you want to delete this question?')) return;
  
  allTakes[currentCategory].splice(index, 1);
  saveData();
  renderList();
}

function startEdit(index, li) {
  li.classList.add('editing');
  const input = li.querySelector('.edit-input');
  input.focus();
  input.select();
  
  const editBtn = li.querySelector('.edit-btn');
  editBtn.textContent = '✓';
  editBtn.classList.add('save-btn');
}

function saveEdit(index, li) {
  const input = li.querySelector('.edit-input');
  const newText = input.value.trim();
  
  if (!newText) {
    alert('Question cannot be empty.');
    return;
  }
  
  allTakes[currentCategory][index] = newText;
  saveData();
  renderList();
}

function clearAll() {
  if (!confirm(`Are you sure you want to delete ALL ${currentCategory} questions? This cannot be undone.`)) return;
  
  allTakes[currentCategory] = [];
  saveData();
  renderList();
}

function exportData() {
  const dataStr = JSON.stringify(allTakes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hot-takes-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (imported.filipino && imported.international) {
        if (confirm('This will replace all current questions. Continue?')) {
          allTakes = imported;
          saveData();
          renderList();
          alert('Import successful!');
        }
      } else {
        alert('Invalid file format. Must contain "filipino" and "international" arrays.');
      }
    } catch (err) {
      alert('Error reading file: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function switchCategory(category) {
  currentCategory = category;
  renderList();
}

document.addEventListener('DOMContentLoaded', () => {
  loadData();
  renderList();

  // Category selection
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      switchCategory(e.target.dataset.category);
    });
  });

  // Add question
  $('addBtn').addEventListener('click', addQuestion);
  newQuestionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addQuestion();
  });

  // Edit and delete
  questionList.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const index = parseInt(btn.dataset.index);
    const li = btn.closest('.question-item');

    if (btn.classList.contains('delete-btn')) {
      deleteQuestion(index);
    } else if (btn.classList.contains('edit-btn') && !btn.classList.contains('save-btn')) {
      startEdit(index, li);
    } else if (btn.classList.contains('save-btn')) {
      saveEdit(index, li);
    }
  });

  // Handle enter key in edit mode
  questionList.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('edit-input')) {
      const li = e.target.closest('.question-item');
      const btn = li.querySelector('.save-btn');
      if (btn) {
        const index = parseInt(btn.dataset.index);
        saveEdit(index, li);
      }
    }
  });

  // Clear all
  $('clearAllBtn').addEventListener('click', clearAll);

  // Export
  $('exportBtn').addEventListener('click', exportData);

  // Import
  $('importFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) importData(file);
    e.target.value = ''; // Reset input
  });
});
