// 获取span元素
const editableText = document.getElementById('edit_hover_text');

// 从localStorage读取并设置初始文本（如果有保存的内容）
if (localStorage.getItem('textContent')) {
    editableText.textContent = localStorage.getItem('textContent');
}

// 添加点击事件，允许用户修改文本
editableText.addEventListener('click', () => {
    const currentText = editableText.textContent;
    const newText = prompt('编辑文本:', currentText);

    if (newText !== null && newText !== currentText) {
        editableText.textContent = newText;
        // 将修改后的文本保存到localStorage
        localStorage.setItem('textContent', newText);
    }
});

const quoteText = document.getElementById('edit_quote')
if (localStorage.getItem('textQuote')) {
    quoteText.textContent = localStorage.getItem('textQuote');
}
quoteText.addEventListener('click', () => {
    const currentText = quoteText.textContent;
    const newText = prompt('编辑文本:', currentText);

    if (newText !== null && newText !== currentText) {
        quoteText.textContent = newText;
        // 将修改后的文本保存到localStorage
        localStorage.setItem('textQuote', newText);
    }
});

// 加载列表数据并渲染
function loadList() {
    const categories = ['projects', 'codeStacks', 'awards'];
    categories.forEach(category => {
        const list = JSON.parse(localStorage.getItem(category)) || initialData[category];
        const listContainer = document.getElementById(`${category}-list`);
        listContainer.innerHTML = ''; // 清空现有列表

        list
            .filter(item => typeof item === 'string') // 筛选出字符串类型的数据
            .forEach(item => {
                const p = document.createElement('p');
                p.textContent = item; // 确保 item 是字符串
                p.onclick = () => editItem(category, p, item);

                const deleteBtn = document.createElement('span');
                deleteBtn.classList.add('delete-btn');
                deleteBtn.textContent = '×';
                deleteBtn.onclick = (e) => {
                    e.stopPropagation();
                    deleteItem(category, p, item);
                };
                p.appendChild(deleteBtn);
                listContainer.appendChild(p);
            });
    });
}

// 编辑条目
function editItem(category, p, oldText) {
    customPrompt('Edit item:', p.textContent.replace('×', '').trim(), (newText) => {
        if (newText !== null && newText !== oldText) {
            p.textContent = newText;

            // 添加删除按钮
            const deleteBtn = document.createElement('span');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = '×';
            deleteBtn.onclick = (e) => { e.stopPropagation(); deleteItem(category, p, newText); };
            p.appendChild(deleteBtn);

            // 更新 localStorage 数据
            const list = JSON.parse(localStorage.getItem(category)) || initialData[category];
            const index = list.indexOf(oldText);
            if (index > -1) {
                list[index] = newText;
                localStorage.setItem(category, JSON.stringify(list));
            }
        }
    });
}


function deleteItem(category, element, item) {
    const list = JSON.parse(localStorage.getItem(category)) || initialData[category];
    const updatedList = list.filter(entry => entry !== item); // 移除匹配的项
    localStorage.setItem(category, JSON.stringify(updatedList)); // 更新 localStorage
    element.remove(); // 从 DOM 中移除对应的 <p>
}


// 增加新条目
function addItem(category) {
    customPrompt('Enter new item:', '', (newText) => {
        if (newText) {
            const list = JSON.parse(localStorage.getItem(category)) || initialData[category];
            list.push(newText);
            localStorage.setItem(category, JSON.stringify(list));
            loadList();
        }
    });
}


function customPrompt(title, defaultValue, callback) {
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '9998';
  
    // 创建弹窗容器
    const promptBox = document.createElement('div');
    promptBox.style.position = 'fixed';
    promptBox.style.top = '50%';
    promptBox.style.left = '50%';
    promptBox.style.transform = 'translate(-50%, -50%)';
    promptBox.style.width = '300px';
    promptBox.style.padding = '20px';
    promptBox.style.backgroundColor = '#fff';
    promptBox.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    promptBox.style.borderRadius = '8px';
    promptBox.style.zIndex = '9999';
    promptBox.style.fontFamily = 'Arial, sans-serif';
  
    // 标题
    const titleEl = document.createElement('h3');
    titleEl.textContent = title;
    titleEl.style.margin = '0 0 10px';
    titleEl.style.fontSize = '18px';
    titleEl.style.color = '#333';
  
    // 输入框
    const input = document.createElement('input');
    input.type = 'text';
    input.value = defaultValue || '';
    input.style.width = '80%';
    input.style.padding = '10px';
    input.style.marginBottom = '10px';
    input.style.border = '1px solid #ddd';
    input.style.borderRadius = '4px';
    input.style.fontSize = '14px';
  
    // 按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.textAlign = 'right';
  
    // 确认按钮
    const confirmButton = document.createElement('button');
    confirmButton.textContent = '确认';
    confirmButton.style.marginRight = '10px';
    confirmButton.style.padding = '8px 12px';
    confirmButton.style.border = 'none';
    confirmButton.style.borderRadius = '4px';
    confirmButton.style.backgroundColor = '#007bff';
    confirmButton.style.color = '#fff';
    confirmButton.style.cursor = 'pointer';
  
    // 取消按钮
    const cancelButton = document.createElement('button');
    cancelButton.textContent = '取消';
    cancelButton.style.padding = '8px 12px';
    cancelButton.style.border = 'none';
    cancelButton.style.borderRadius = '4px';
    cancelButton.style.backgroundColor = '#6c757d';
    cancelButton.style.color = '#fff';
    cancelButton.style.cursor = 'pointer';
  
    // 按钮点击事件
    confirmButton.addEventListener('click', () => {
      const result = input.value.trim();
      if (callback) callback(result);
      document.body.removeChild(promptBox);
      document.body.removeChild(overlay);
    });
  
    cancelButton.addEventListener('click', () => {
      if (callback) callback(null);
      document.body.removeChild(promptBox);
      document.body.removeChild(overlay);
    });
  
    // 组装元素
    buttonContainer.appendChild(confirmButton);
    buttonContainer.appendChild(cancelButton);
    promptBox.appendChild(titleEl);
    promptBox.appendChild(input);
    promptBox.appendChild(buttonContainer);
    document.body.appendChild(overlay);
    document.body.appendChild(promptBox);
  
    // 自动聚焦输入框
    input.focus();
  }


// 初始化加载页面内容
loadList();