// 初始化ECharts实例，将图表绑定到HTML中的元素（id为'chart'的DOM元素）
var myChart = echarts.init(document.getElementById('chart'));

// 数据部分：定义了时间分配的相关数据
const data = [
    { index: 0, Study: 10, Music: 0, Game: 0, Coding: 0, Family: 70 },
    { index: 6, Study: 30, Music: 0, Game: 0, Coding: 0, Family: 40 },
    { index: 9, Study: 50, Music: 0, Game: 20, Coding: 0, Family: 30 },
    { index: 12, Study: 40, Music: 10, Game: 30, Coding: 10, Family: 25 },
    { index: 15, Study: 30, Music: 10, Game: 40, Coding: 20, Family: 20 },
    { index: 18, Study: 20, Music: 20, Game: 30, Coding: 30, Family: 20 },
    { index: 20, Study: 20, Music: 15, Game: 20, Coding: 40, Family: 15 }
];

// 定义类别及对应的颜色
const categories = ['Study', 'Music', 'Game', 'Coding', 'Family'];
const colors = ['#A7F3D0', '#FFD580', '#A0D3FF', '#FF9999', '#99FFCC'];

// 提取横轴数据
const xData = data.map(d => d.index);

// 根据类别生成 series 数据
const seriesData = categories.map((category, index) => ({
    name: category,
    type: 'line',
    smooth: true, // 平滑的曲线
    symbol: 'none', // 不显示标记点
    areaStyle: {
        color: colors[index],
        opacity: 0.5 // 透明度设置
    },
    emphasis: { focus: 'series' }, // 鼠标悬停时高亮
    lineStyle: {
        width: 2,
        color: colors[index]
    },
    data: data.map(d => d[category])
}));

// 配置图表选项
const option = {
    backgroundColor: '#F4F4F4', // 背景颜色
    tooltip: {
        trigger: 'axis', // 显示轴上的所有数据
        axisPointer: {
            type: 'shadow', // 使用阴影指示
            label: { backgroundColor: '#6a7985' }
        }
    },
    grid: {
        left: '5%', // 图表网格左侧边距
        right: '5%', // 图表网格右侧边距
        bottom: '10%', // 图表网格底部边距
        containLabel: true // 防止标签溢出
    },
    xAxis: {
        type: 'category',
        boundaryGap: false, // 数据点紧贴坐标轴
        data: xData,
        axisLabel: {
            fontSize: 12,
            formatter: value => (value % 5 === 0 ? value : '') // 每隔5个标签显示
        }
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            fontSize: 12,
            formatter: value => value + '%' // 添加百分比符号
        },
        splitLine: {
            lineStyle: {
                color: '#DDD' // 分割线颜色
            }
        }
    },
    series: seriesData // 数据系列
};

// 渲染图表
myChart.setOption(option);

// 响应式调整图表大小
window.addEventListener('resize', () => {
    myChart.resize();
});
