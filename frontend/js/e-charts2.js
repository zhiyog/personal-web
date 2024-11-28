// 获取容器并初始化 ECharts 实例
var chartDom = document.getElementById("chart2");
if (!chartDom) {
  console.error("容器元素未找到");
}
var myChart = echarts.init(chartDom);

// 配置选项
var option2 = {
  // 可视化映射（颜色渐变设置）
  visualMap: {
    top: "middle", // 垂直方向居中
    right: 10, // 水平方向靠右
    color: ["#27ff47", "#ffff82", "#f127ff"], // 颜色梯度
    calculable: true, // 是否启用拖拽以调整数值范围
  },
  // 雷达图配置
  radar: {
    indicator: [
      { text: "IE8-", max: 400 },
      { text: "IE9+", max: 400 },
      { text: "Safari", max: 400 },
      { text: "Firefox", max: 400 },
      { text: "Chrome", max: 400 },
    ],
    shape: "circle", // 雷达图形状设置为圆形
    splitNumber: 5, // 网格分段数
    axisName: {
      color: "#555", // 指标名称颜色
      fontSize: 12, // 指标名称字体大小
    },
    splitLine: {
      lineStyle: {
        color: "rgba(0, 0, 0, 0.2)", // 分割线颜色
      },
    },
    // splitArea: {
    //   areaStyle: {
    //     color: [ "rgba(255, 255, 255, 0.1)"], // 分割区域的交替颜色
    //   },
    // },
  },
  // 数据系列
  series: Array.from({ length: 28 }, (_, i) => ({
    type: "radar",
    symbol: "none", // 不显示数据点
    lineStyle: {
      width: 2,
      color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: "#27ff47" },
        { offset: 0.5, color: "#ffff82" },
        { offset: 1, color: "#f127ff" },
      ]), // 渐变色
    },
    emphasis: {
      lineStyle: { width: 3, color: "#f39c12" }, // 高亮时线宽及颜色
      areaStyle: { color: "rgba(255, 193, 7, 0.3)" }, // 高亮时的填充区域
    },
    data: [
      {
        value: [
          (40 - i) * 10, // 数据生成逻辑
          (38 - i) * 4 + 60,
          i * 5 + 10,
          i * 9,
          (i * i) / 2,
        ],
        name: 2000 + i + "", // 数据名称
      },
    ],
  })),
};

// 使用配置项生成图表
myChart.setOption(option2);

// 响应式调整图表大小
window.addEventListener("resize", () => {
  myChart.resize();
});
