export function getElectricityEChartsTemplate() {
    return {
        grid: {
            left: '3%',
            right: '4%',
            bottom: '2%',
            containLabel: true
        },
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'shadow'
            }
        },
        // toolbox: {
        //     show: true,
        //     feature: {
        //         saveAsImage: {},
        //     }
        // },
        legend: {
            left: '20%',
            width: '75%',
            type: 'scroll',
            pageIconColor: '#ffffff',
            pageIconSize: 18,
            pageTextStyle: {
                color: '#ffffff'
            },
            data: [
                // {
                //   name: '收费系统',
                //   color: '#00baff'
                // },
                // {
                //   name: '监控系统',
                //   color: '#ff5ca9'
                // },
                // {
                //   name: '通信系统',
                //   color: '#3de7c9'
                // },
                // {
                //   name: '供配电系统',
                //   color: '#f5d94e'
                // }
            ],
            // textStyle: {
            //     fill: '#fff'
            // }
        },
        title: {
            text: '每日用电量'
        },
        xAxis: {
            //x轴倾斜
            // axisLabel: {
            //     rotate: -30
            // },
            data: [
                // '00', '01', '02', '03', '04', '05', '06'
            ],
        },
        yAxis: [{
            name: '消耗量',
            type: 'value',
            axisLabel: {
                formatter: '{value} KW/H'
            },
        },
        {
            name: '占比',
            type: 'value',
            position: 'right',
            axisLabel: {
                formatter: '{value} %',
            }
        }],
        series: [
            // {
            //   data: [1200, 2230, 1900, 2100, 3500, 4200, 3985],
            //   type: 'bar'
            // }
        ]
    }
}