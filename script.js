// 全局变量
let selectedTemplate = null;
let uploadedImage = null;
let imagePosition = { x: 0, y: 0 };
let imageScale = 1;
let isDragging = false;
let dragStart = { x: 0, y: 0 };

// 模板数据
const templates = [
    {
        id: 1,
        name: "模板1",
        image: "images/template1.png"
    },
    {
        id: 2,
        name: "模板2",
        image: "images/template2.png"
    },
    {
        id: 3,
        name: "模板3",
        image: "images/template3.png"
    },
    {
        id: 4,
        name: "模板4",
        image: "images/template4.png"
    },
    {
        id: 5,
        name: "模板5",
        image: "images/template5.png"
    }
];

// 初始化
function init() {
    renderTemplates();
    setupEventListeners();
}

// 渲染模板
function renderTemplates() {
    const templateGrid = document.getElementById('templateGrid');
    templateGrid.innerHTML = '';
    
    templates.forEach(template => {
        const templateItem = document.createElement('div');
        templateItem.className = 'template-item';
        templateItem.dataset.templateId = template.id;
        
        const img = document.createElement('img');
        img.src = template.image;
        img.alt = template.name;
        
        templateItem.appendChild(img);
        templateGrid.appendChild(templateItem);
        
        // 添加点击事件
        templateItem.addEventListener('click', () => selectTemplate(template.id));
    });
}

// 选择模板
function selectTemplate(templateId) {
    // 移除所有选中状态
    document.querySelectorAll('.template-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // 添加选中状态
    const selectedItem = document.querySelector(`.template-item[data-template-id="${templateId}"]`);
    if (selectedItem) {
        selectedItem.classList.add('selected');
        selectedTemplate = templates.find(t => t.id === templateId);
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 照片上传
    const photoUpload = document.getElementById('photoUpload');
    photoUpload.addEventListener('change', handlePhotoUpload);
    
    // 生成海报
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.addEventListener('click', generatePoster);
    
    // 下载海报
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.addEventListener('click', downloadPoster);
}

// 处理照片上传
function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            uploadedImage = img;
            // 显示预览
            const uploadPreview = document.getElementById('uploadPreview');
            uploadPreview.innerHTML = '';
            uploadPreview.appendChild(img);
            img.style.maxWidth = '100%';
            img.style.maxHeight = '200px';
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// 生成海报
function generatePoster() {
    if (!selectedTemplate || !uploadedImage) {
        alert('请先选择模板并上传照片');
        return;
    }
    
    const canvas = document.getElementById('posterCanvas');
    
    // 重置图片位置和大小
    imagePosition = {
        x: (canvas.width - uploadedImage.width * 0.7) / 2,
        y: (canvas.height - uploadedImage.height * 0.7) / 2
    };
    imageScale = 0.7;
    
    // 绘制海报
    drawPoster();
    
    // 添加交互功能
    setupCanvasInteraction();
    
    // 显示下载按钮
    document.getElementById('downloadBtn').style.display = 'inline-block';
}

// 绘制海报
function drawPoster() {
    const canvas = document.getElementById('posterCanvas');
    const ctx = canvas.getContext('2d');
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 加载模板图片
    const templateImg = new Image();
    templateImg.onload = function() {
        // 绘制模板
        ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);
        
        // 计算照片大小
        const photoWidth = uploadedImage.width * imageScale;
        const photoHeight = uploadedImage.height * imageScale;
        
        // 绘制照片
        ctx.drawImage(uploadedImage, imagePosition.x, imagePosition.y, photoWidth, photoHeight);
    };
    templateImg.src = selectedTemplate.image;
}

// 设置画布交互
function setupCanvasInteraction() {
    const canvas = document.getElementById('posterCanvas');
    
    // 鼠标按下事件
    canvas.addEventListener('mousedown', function(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // 计算照片边界
        const photoWidth = uploadedImage.width * imageScale;
        const photoHeight = uploadedImage.height * imageScale;
        
        // 检查鼠标是否在照片上
        if (mouseX >= imagePosition.x && mouseX <= imagePosition.x + photoWidth &&
            mouseY >= imagePosition.y && mouseY <= imagePosition.y + photoHeight) {
            isDragging = true;
            dragStart.x = mouseX - imagePosition.x;
            dragStart.y = mouseY - imagePosition.y;
        }
    });
    
    // 鼠标移动事件
    canvas.addEventListener('mousemove', function(e) {
        if (isDragging) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // 更新图片位置
            imagePosition.x = mouseX - dragStart.x;
            imagePosition.y = mouseY - dragStart.y;
            
            // 重绘海报
            drawPoster();
        }
    });
    
    // 鼠标释放事件
    canvas.addEventListener('mouseup', function() {
        isDragging = false;
    });
    
    // 鼠标离开事件
    canvas.addEventListener('mouseleave', function() {
        isDragging = false;
    });
    
    // 滚轮缩放事件
    canvas.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // 计算照片边界
        const photoWidth = uploadedImage.width * imageScale;
        const photoHeight = uploadedImage.height * imageScale;
        
        // 检查鼠标是否在照片上
        if (mouseX >= imagePosition.x && mouseX <= imagePosition.x + photoWidth &&
            mouseY >= imagePosition.y && mouseY <= imagePosition.y + photoHeight) {
            // 计算缩放因子
            const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
            
            // 更新缩放比例
            const newScale = Math.max(0.1, Math.min(2, imageScale * scaleFactor));
            
            // 计算缩放中心
            const scaleCenterX = mouseX - imagePosition.x;
            const scaleCenterY = mouseY - imagePosition.y;
            
            // 调整位置以保持鼠标在同一位置
            imagePosition.x = mouseX - scaleCenterX * (newScale / imageScale);
            imagePosition.y = mouseY - scaleCenterY * (newScale / imageScale);
            
            // 更新缩放比例
            imageScale = newScale;
            
            // 重绘海报
            drawPoster();
        }
    });
}

// 下载海报
function downloadPoster() {
    const canvas = document.getElementById('posterCanvas');
    const dataURL = canvas.toDataURL('image/png');
    
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = '海报.png';
    link.click();
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);