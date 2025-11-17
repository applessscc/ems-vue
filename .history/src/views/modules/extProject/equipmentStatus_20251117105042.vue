<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>回流焊炉 实时图</title>
  <script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>
  <style>
    html, body { margin:0; height:100%; background:#e5f0f7; display:flex; justify-content:center; align-items:center;}
    #main { width:1200px; height:650px; background:white; border-radius:10px; box-shadow:0 0 10px rgba(0,0,0,0.15);}
  </style>
</head>
<body>
<div id="main"></div>
<script>
const chart = echarts.init(document.getElementById('main'));

const zoneCount = 10;
const zoneWidth = 80;
const startX = 160;
const topY = 180;
const bottomY = 360;

let topSetValues = Array(zoneCount).fill(0);
let topActualValues = Array(zoneCount).fill(0);
let bottomSetValues = Array(zoneCount).fill(0);
let bottomActualValues = Array(zoneCount).fill(0);

async function fetchData() {
  try {
    const res = await fetch('http://localhost:8080/ems-admin/extProject/getEquipmentStatus?equipment=S2-G00000-003-0600');
    const json = await res.json();
    const dataJSON = JSON.parse(json.data.dataJSON);

    for(let i=0;i<zoneCount;i++){
      topSetValues[i] = dataJSON[i].sv;
      topActualValues[i] = dataJSON[i].pv;
      bottomSetValues[i] = dataJSON[i+zoneCount].sv;
      bottomActualValues[i] = dataJSON[i+zoneCount].pv;
    }

    drawChart();
  } catch(err){
    console.error('获取设备数据失败:',err);
  }
}

function drawChart(){
  const graphics = [];

  // 左右斜角
  graphics.push(
    { type:'polygon', shape:{points:[[startX-120,topY+20],[startX-60,topY],[startX-60,bottomY+100],[startX-120,bottomY+80]]}, style:{fill:'#bbb', stroke:'#666', lineWidth:2}},
    { type:'polygon', shape:{points:[[startX+zoneCount*zoneWidth+60,topY],[startX+zoneCount*zoneWidth+120,topY+20],[startX+zoneCount*zoneWidth+120,bottomY+80],[startX+zoneCount*zoneWidth+60,bottomY+100]]}, style:{fill:'#bbb', stroke:'#666', lineWidth:2}}
  );

  // 上下层外框
  graphics.push(
    { type:'rect', shape:{x:startX-60, y:topY, width:zoneCount*zoneWidth+120, height:100}, style:{fill:'#d9d9d9', stroke:'#555', lineWidth:2}},
    { type:'rect', shape:{x:startX-60, y:bottomY, width:zoneCount*zoneWidth+120, height:100}, style:{fill:'#d9d9d9', stroke:'#555', lineWidth:2}}
  );

  // 传送带
  graphics.push(
    { type:'rect', shape:{x:startX-40, y:topY+110, width:zoneCount*zoneWidth+80, height:10}, style:{fill:'#0044cc'}},
    { type:'rect', shape:{x:startX-40, y:bottomY-10, width:zoneCount*zoneWidth+80, height:10}, style:{fill:'#0044cc'}}
  );

  // 信号灯柱
  graphics.push(
    { type:'rect', shape:{x:startX-140,y:topY-100,width:10,height:100}, style:{fill:'#666'} },
    { type:'rect', shape:{x:startX-145,y:topY-120,width:20,height:20}, style:{fill:'#00ff00',stroke:'#333'} },
    { type:'rect', shape:{x:startX-145,y:topY-140,width:20,height:20}, style:{fill:'#ffff00',stroke:'#333'} },
    { type:'rect', shape:{x:startX-145,y:topY-160,width:20,height:20}, style:{fill:'#ff0000',stroke:'#333'} }
  );

  for(let i=0;i<zoneCount;i++){
    const x = startX + i*zoneWidth;

    // 上下温区矩形
    graphics.push({ type:'rect', shape:{x, y:topY+10,width:zoneWidth-5,height:40}, style:{fill:'#fff', stroke:'#999', lineWidth:1} });
    graphics.push({ type:'rect', shape:{x, y:bottomY+10,width:zoneWidth-5,height:40}, style:{fill:'#fff', stroke:'#999', lineWidth:1} });

    if(i===0){
      // 上层标签
      graphics.push({ type:'text', style:{x:x-55, y:topY+25, text:'设定值', font:'12px monospace', fill:'#333'} }); // 无框
      graphics.push({ type:'rect', shape:{x:x-60, y:topY+30, width:55, height:20}, style:{fill:'rgba(200,200,200,0.2)',stroke:'rgba(200,200,200,0.2)',lineWidth:0.5,radius:3} });
      graphics.push({ type:'text', style:{x:x-55, y:topY+45, text:'实际值', font:'12px monospace', fill:'#333'} });

      // 下层标签
      graphics.push({ type:'rect', shape:{x:x-60, y:bottomY+10, width:55, height:20}, style:{fill:'rgba(200,200,200,0.2)',stroke:'rgba(200,200,200,0.2)',lineWidth:0.5,radius:3} });
      graphics.push({ type:'text', style:{x:x-55, y:bottomY+25, text:'实际值', font:'12px monospace', fill:'#333'} });
      graphics.push({ type:'text', style:{x:x-55, y:bottomY+45, text:'设定值', font:'12px monospace', fill:'#333'} }); // 无框
    }

    // SV/PV显示
    graphics.push({ type:'text', style:{x:x+10, y:topY+30, text:`${topSetValues[i]}℃`, font:'14px monospace', fill:'#333'} });
    graphics.push({ type:'text', style:{x:x+10, y:topY+55, text:`${topActualValues[i]}℃`, font:'bold 14px monospace', fill:'#00aa00'} });
    graphics.push({ type:'text', style:{x:x+10, y:bottomY+30, text:`${bottomSetValues[i]}℃`, font:'14px monospace', fill:'#333'} });
    graphics.push({ type:'text', style:{x:x+10, y:bottomY+55, text:`${bottomActualValues[i]}℃`, font:'bold 14px monospace', fill:'#00aa00'} });
  }

  // 标题
  graphics.push({ type:'text', left:'center', top:30, style:{text:'回流焊炉温区示意图（ECharts）', font:'bold 22px Microsoft YaHei', fill:'#333'} });

  chart.setOption({ graphic: graphics });
}

fetchData();
setInterval(fetchData,5000);
</script>
</body>
</html>
