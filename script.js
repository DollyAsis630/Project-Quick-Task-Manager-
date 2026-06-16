let tasks = [];
let members = [
{id:1,name:'Alex',role:'Developer',avatar:'👨‍💻'},
{id:2,name:'Sophie',role:'Designer',avatar:'👩‍🎨'}
];

function init(){
const saved=localStorage.getItem('quickTasks');
tasks=saved?JSON.parse(saved):[
{id:1,title:'Fix login bug',desc:'Login not working',status:'In Progress',priority:'High'},
{id:2,title:'Design dashboard',desc:'Create UI',status:'To Do',priority:'Medium'},
{id:3,title:'Setup DB',desc:'MongoDB Atlas',status:'Done',priority:'High'}
];
renderAll();
}

function renderAll(){renderTasks();renderKanban();renderTeam();updateStats();}
function saveTasks(){localStorage.setItem('quickTasks',JSON.stringify(tasks));}
function filtered(){const s=document.getElementById('searchInput').value.toLowerCase();const st=document.getElementById('statusFilter').value;return tasks.filter(t=>{if(s&&!t.title.toLowerCase().includes(s))return false;if(st&&t.status!==st)return false;return true;});}

function updateStats(){
document.getElementById('totalTasks').textContent=tasks.length;
document.getElementById('todoCount').textContent=tasks.filter(t=>t.status==='To Do').length;
document.getElementById('doneCount').textContent=tasks.filter(t=>t.status==='Done').length;
document.getElementById('taskCount').textContent=tasks.length;
document.getElementById('memberCount').textContent=members.length;
}

function renderTasks(){
const list=document.getElementById('taskList'),arr=filtered();
list.innerHTML=arr.length?arr.map(t=>`<div class="task-item" onclick="openTask(${t.id})"><div class="task-header"><strong>${t.title}</strong><div class="task-meta"><span class="tag ${t.priority==='High'?'tag-high':t.priority==='Medium'?'tag-medium':'tag-low'}">${t.priority}</span><span class="tag ${t.status==='Done'?'tag-done':t.status==='In Progress'?'tag-progress':'tag-todo'}">${t.status}</span></div></div><div style="color:#64748b;font-size:13px;margin-top:6px">${t.desc||''}</div></div>`).join(''):'<p style="color:#64748b">No tasks found</p>';
}

function addTask(){
const title=document.getElementById('taskTitle').value.trim(),desc=document.getElementById('taskDesc').value,priority=document.getElementById('taskPriority').value;
if(!title)return alert('Enter title');
tasks.push({id:Date.now(),title,desc,status:'To Do',priority});
saveTasks();renderAll();
document.getElementById('taskTitle').value='';document.getElementById('taskDesc').value='';
}

function renderKanban(){
const board=document.getElementById('kanbanBoard'),cols=['To Do','In Progress','Done'];
board.innerHTML=cols.map(c=>`<div class="kanban-column"><div class="kanban-header ${c==='To Do'?'kanban-todo':c==='In Progress'?'kanban-progress':'kanban-done'}"><span>${c}</span><span>${filtered().filter(t=>t.status===c).length}</span></div>${filtered().filter(t=>t.status===c).map(t=>`<div class="kanban-task" onclick="openTask(${t.id})"><strong>${t.title}</strong><div style="display:flex;justify-content:space-between;margin-top:8px"><span class="tag ${t.priority==='High'?'tag-high':'tag-medium'}">${t.priority}</span><select onchange="updateStatus(${t.id},this.value)"><option>To Do</option><option>In Progress</option><option>Done</option></select></div></div>`).join('')}</div>`).join('');
}

function updateStatus(id,status){const task=tasks.find(t=>t.id===id);if(task){task.status=status;saveTasks();renderAll();}}
function openTask(id){const t=tasks.find(x=>x.id===id);if(!t)return;document.getElementById('modalTitle').textContent=t.title;document.getElementById('modalDesc').textContent=t.desc||'No description';document.getElementById('modalPriority').textContent=t.priority;document.getElementById('modalStatus').textContent=t.status;document.getElementById('modalPriority').className=`tag ${t.priority==='High'?'tag-high':t.priority==='Medium'?'tag-medium':'tag-low'}`;document.getElementById('modalStatus').className=`tag ${t.status==='Done'?'tag-done':t.status==='In Progress'?'tag-progress':'tag-todo'}`;document.getElementById('modal').classList.add('active');}
function closeModal(){document.getElementById('modal').classList.remove('active');}
function deleteCurrentTask(){const title=document.getElementById('modalTitle').textContent;tasks=tasks.filter(t=>t.title!==title);saveTasks();closeModal();renderAll();}

function addMember(){
const name=document.getElementById('memberName').value.trim();
const role=document.getElementById('memberRole').value;
if(!name)return alert('Enter name');
members.push({id:Date.now(),name,role,avatar:'👤'});
renderTeam();updateStats();
document.getElementById('memberName').value='';
}

function removeMember(id){
members=members.filter(m=>m.id!==id);
renderTeam();updateStats();
}

function renderTeam(){
document.getElementById('teamGrid').innerHTML=members.map(m=>`<div class="team-member"><div class="member-head" style="width:100%"><div><strong>${m.name}</strong><div class="member-role">${m.role}</div></div><button class="del-btn" onclick="removeMember(${m.id})">Delete</button></div></div>`).join('');
}

document.querySelectorAll('.menu-item').forEach(item=>item.addEventListener('click',e=>{e.preventDefault();document.querySelectorAll('.menu-item').forEach(i=>i.classList.remove('active'));item.classList.add('active');document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));document.getElementById(item.dataset.page+'Page').classList.add('active');if(item.dataset.page==='board')renderKanban();}));
document.getElementById('searchInput').addEventListener('input',renderAll);
document.getElementById('statusFilter').addEventListener('change',renderAll);
init();