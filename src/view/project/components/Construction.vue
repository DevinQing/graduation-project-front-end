<template>
  <div class="construction-container">
    <h1>施工信息</h1>
    <h2>1.路基</h2>
    <h3>1.1质量标准</h3>
    <p>
      土质路基土经压实后，无松散、软弹、翻浆及表面不平整现象，土、石路床用12～15t振动压路机碾压，其轮迹不大于5mm，土质路床无翻浆、软弹、起皮、波浪、积水等现象。压实度（重型击实标准）：
    </p>
    <img src="../../../assets/images/还有半年 加油！.jpg" alt="" />
    <h2>1.2路基排水</h2>
    <p>
      路基施工时注意了排水，合理安排排水路线，充分利用沿线已建和新建的永久性排水设施。所有施工临时排水管、排水沟和盲沟的水流，均引至管道中。路基分层挖填时根据土的透水性能将表面筑成2－4％的横坡度，并注意了纵向排水，经常平整现场，清理散落的土，利地面排水。当地面水排除困难而无永久性管道收集可利用时，设置了临时排水设施。
    </p>
    <p>由于周边地处居民区，不宜采用爆破，尽量采用人工开挖。</p>
    <h2>1.3填方路基</h2>
    <p>（1）填料要求</p>
    <p>
      路基填土没有使用腐殖土，生活垃圾土、淤泥，不得含杂草、树根等杂物，粒径超过10CM的土块应打碎。选用级配较好的粗粒土为填料，且应优先选用砾类土、砂类土，且在最佳含水量时压实。路基填方若为土石混和料，且石料强度大于20MPa时，石块的最大粒没有超过压实层厚2／3，当石料强度小于15Mpa，石料最大粒径不得超过压实层厚。路基填料最小强度符合下表。
    </p>
  </div>
</template>

<script>
export default {
  name: 'ProjectConstruction'
}
</script>

<style lang="scss" scoped>
.construction-container {
  text-align: center;
  padding: 20px;
  h1 {
    font-size: 24px;
    font-weight: 600;
    margin: 15px 0;
  }
  h2 {
    text-align: left;
    font-size: 20px;
    font-weight: 600;
    margin: 5px;
  }
  h3 {
    text-align: left;
    font-size: 18px;
    padding: 5px;
    font-weight: 600;
  }
  p {
    text-align: left;
    margin: 5px;
    text-indent: 2em;
    line-height: 30px;
  }
  img {
    width: 70%;
  }
}
</style>
