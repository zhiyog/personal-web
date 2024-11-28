// 获取必要的 DOM 元素
const editHeadPicture = document.getElementById("edit_head_picture");
const fileInput = document.getElementById("fileInput");
const headPictureSrc = localStorage.getItem("headPictureSrc");
if (headPictureSrc) {
  editHeadPicture.src = headPictureSrc;
} else {
  editHeadPicture.src = "./img/head_picture.png";
}
// 点击头像编辑按钮时，触发文件选择对话框
editHeadPicture.addEventListener("click", function () {
  fileInput.click();
});

// 监听文件选择事件
fileInput.addEventListener("change", function (event) {
  const file = event.target.files[0]; // 获取用户选择的文件
  if (file) {
    const formData = new FormData();
    formData.append("head_picture", file);
    
    // 使用 fetch 上传文件到服务器
    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.message === "文件上传成功") {
          // 从服务器响应中获取新的图片路径
          const newImagePath = data.filePath;

          // 使用 localStorage 保存新的路径以保持更新
          localStorage.setItem("headPictureSrc", newImagePath);
          location.reload();

        } else {
          alert("上传失败: " + data.message);
        }
      })
      .catch((error) => {
        console.error("上传出错:", error);
        alert("上传出错，请稍后再试！");
      });
  }
});

// 页面加载时检查是否有保存的头像路径
window.onload = function () {
  const savedSrc = localStorage.getItem("headPictureSrc");
  if (savedSrc) {
    headPictureSrc = savedSrc;
    editHeadPicture.src = savedSrc;
  }
};
