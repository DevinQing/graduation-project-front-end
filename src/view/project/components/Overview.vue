<template>
  <div class="overview-container">
    <h1>工程概况</h1>
    <h2>1.工程规模</h2>
    <p>
      解放碑地下环道主通道长度约为2.818km，根据《城市地下道路工程设计规范》CJJ
      221-2015，为长距离城市地下道路，属于小（微）型客车专用隧道，严格控制其他超限车辆进入通道。
      根据建设时序，解放碑地下停车系统分为三期实施。
    </p>

    <p>根据建设时序，解放碑地下停车系统分为三期实施。</p>
    <p>
      一期工程：主通道K0+000-K1+80段、连接道一（北区路地下道）、连接道二（十八梯地下道），两条车库连接支洞。
    </p>
    <p>
      二期工程:
      主通道K1+080-K2+150段、连接道一（储奇门地下道）、连接道二（文化街地下道）、三条车库连接支洞。
    </p>
    <p>
      三期工程：主通道K2+150-K2+817.884段、嘉宾路连接道（临江路地下道）、两江桥隧道连接道一（九尺坎地下道）、两江桥隧道连接道二（民族路地下道）、一个车库连接支洞。
    </p>
    <h2>2.项目区位</h2>

    <p>
      解放碑地下环道位于重庆市渝中区的解放碑核心区，其目的在于缓解解放碑地区地面交通拥堵并提高地下停车系统的利用率和周转率，达到综合改善该地区交通状况的目的。包括“一环七射多连通”。“一环”即沿地下环形主通道，根据建设时序由一二三期工程组成，“七射”即七条进出主通道的通道。“多连通”即由各个车库之间的连通。通过“一环七射多连通”实现资源共享，管理统一、技术先进、运行高效的地下停车系统。
    </p>
    <img src="../../../assets/images/以后再也不见.jpg" alt="" />
  </div>
</template>

<script>
export default {
  name: 'ProjectOverview'
}
</script>

<style lang="scss" scoped>
.overview-container {
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
