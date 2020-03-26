
// 纸张类型吨价
const paperPricePerTon = {
  // 大度纸
  A: {
    // 128g铜版纸吨价
    ArtPaper128g: 6800,
    // 157g铜版纸吨价
    ArtPaper157g: 6800,
    // 200g铜版纸吨价
    ArtPaper200g: 6800
  }
}

// 纸张长宽数据
const paperParams = {
  // 大度纸
  A: {
    A0: [889, 1194],
    A8: [420, 285],
    A16: [285, 210],
    A32: [210, 140],
    A64: [140, 105]
  },
  // 正度纸
  B: {
    B0: [787, 1092],
    B8: [380, 260],
    B16: [260, 185],
    B32: [185, 125],
    B64: [125, 90]
  }
}

// 纸张相关计算系数
const coefficient = {
  // 单价计算系数
  PaperClass: {
    // 大度平板纸系数
    A: 1884,
    // 正度平板纸系数
    B: 2327
  },
  // 纸张损耗率
  WastRatio: {
    // 内文纸张损耗率
    content: 0.018,
    // 封面纸张损耗率
    cover: 0.072
  },
  // 设计费
  DesignUnitPrice: {
    // 版面设计
    layout: 50,
    // 出胶片
    film: 8,
    // 晒PS版
    exposure: 60
  },
  // 打样费用
  Proofing: 25,
  // 色令价格
  ColorReam: 20,
  // 开机费
  MachineCost: 650,
  // 装订费
  BookBinding: 0.06,
  // 哑膜费用
  MatteMembrane: 0.65,
  // 每贴单价
  Section: 0.03,
  // 打包单价
  Packing: {
    kraftPaper: 1.5,
    corrugatedPaper: 2
  }
}

// 报价得到的数据
const quotationData = {
  // 理论上内文用纸量
  contentPapers: 0,
  // 理论上封面用纸量
  coverPapers: 0,
  // 实际上内文用纸量
  actualContentPapers: 0,
  // 实际上封面用纸量
  actualCoverPapers: 0
}

/**
 * 计算封面、内文纸张总价
 * @param {string} paperType 纸张类型：封面、内页
 * @param {number} pages 内文页数
 * @param {number} foldTimes 开数
 * @param {number} albums 总册数
 */
function paperAmount (paperType, pages, foldTimes, albums) {
  // 全开纸数量
  let wholePapers = 0
  // 损耗纸数量
  let wastingPapers = ''
  // 总用纸量
  let amount = 0

  if (paperType === 'content') {
    wholePapers = pages / foldTimes / 2 * albums
  } else {
    wholePapers = albums / foldTimes * 2
  }

  // 计算损耗用纸量
  wastingPapers = wholePapers * coefficient.WastRatio[paperType]
  // 损耗量+需求量
  amount = wholePapers + wastingPapers

  if (paperType === 'content') {
    quotationData.contentPapers = wholePapers
    quotationData.actualContentPapers = amount
  } else {
    quotationData.coverPapers = wholePapers
    quotationData.actualCoverPapers = amount
  }

  console.log(amount)
  return amount
}

/**
 * 计算纸张单价
 * @param {string} paperName 纸张名字
 * @param {string} paperClass 纸张种类：大度A类，正度B类
 */
function paperUnitPrice (paperName, paperClass = 'A') {
  // 获取纸张名中的克重
  const paperWeight = paperName.match(/\d+/)[0]
  // 计算纸张单价
  const unitPrice = paperPricePerTon[paperClass][paperName] * paperWeight / coefficient.PaperClass[paperClass] / 500

  return unitPrice.toFixed(2)
}

/**
 * 版面设计费
 * @param {number} pages 设计页面数：内文页数 (+4 封面页数)
 */
function layoutDesign (pages) {
  return (pages + 4) * coefficient.DesignUnitPrice.layout
}

/**
 * 出胶片费用
 * @param {number} pages 胶片数量：内文页数 (+4 封面页数)
 */
function filmDesign (pages) {
  return (pages + 4) * coefficient.DesignUnitPrice.film
}

/**
 * 晒PS版
 * @param {number} pages 内文页数
 * @param {number} foldTimes  开数
 */
function exposurePS (pages, foldTimes) {
  // 计算印张数量
  const printingSheets = pages / foldTimes
  // 计算一本画册内文所需总印版数= 印张数 * 正反面各4色印版 + 封面自翻版
  const printingForme = printingSheets * 8 + 4

  return printingForme * coefficient.DesignUnitPrice.exposure
}

/**
 * 打样费用
 * @param {number} pages 内文页数
 */
function proofing (pages) {
  return (pages * 4) * coefficient.Proofing
}

/**
 * 印刷费用
 * @param {string} printingType 印刷类型：内文印刷或封面印刷
 */
function printing (printingType) {
  if (printingType === 'content') {
    const contentPrintingCost = quotationData.contentPapers / 500 * coefficient.ColorReam * 4 * 2
    return contentPrintingCost > coefficient.MachineCost ? contentPrintingCost : coefficient.MachineCost
  } else {
    const coverPrintingCost = quotationData.coverPapers / 500 * coefficient.ColorReam * 4 * 2
    // 若封面印刷小于开机费，则按开机费计算
    return coverPrintingCost > coefficient.MachineCost ? coverPrintingCost : coefficient.MachineCost
  }
}

/**
 * 锁线装订费用
 * @param {number} albums 总册数
 * @param {number} pages 内文页数
 * @param {number} foldTimes 开数
 */
function bookBinding (albums, pages, foldTimes) {
  // 计算印张数
  const printingSheets = pages / foldTimes

  return albums * printingSheets * coefficient.BookBinding
}

/**
 *
 * @param {string} paperClass 纸张类型：大度纸、正度纸
 */
function laminating (paperClass) {
  // 拼接纸张名字，如 A0、B0，数字表示的是开数，0是全开
  const paperSize = `${paperClass}0`
  // 计算覆膜面积
  const paperArea = paperParams[paperClass][paperSize][0] * paperParams[paperClass][paperSize][1] / 1000000
  // 计算覆膜价格 = 封面所需全开纸数量 * 一张全开纸面积 * 哑膜单位面积价格
  const laminatingPrice = quotationData.coverPapers * paperArea * coefficient.MatteMembrane

  return laminatingPrice
}

/**
 * 胶装、上封面费用
 * @param {number} albums 总册数
 * @param {number} foldTimes 开数
 * @param {number} pages 内文页数
 */
function plastic (albums, foldTimes, pages) {
  // 一册总印张数 = 内文印张 + 封面印张(2)
  const totalPrintingSheets = pages / foldTimes + 2
  // 一册总印张数 * 一贴单价 * 总册数
  return totalPrintingSheets * coefficient.Section * albums
}

/**
 * 打包费用
 * @param {number} chunks 每包多少册
 * @param {number} albums 总册数
 * @param {string} packingPaper 打包纸类型
 */
function packing (chunks, albums, packingPaper = 'kraftPaper') {
  // 计算打包数量
  const amounts = albums / chunks
  // 打包数量 * 打包纸类型单价
  return amounts * coefficient.Packing[packingPaper]
}

module.exports = {
  paperAmount,
  paperUnitPrice,
  layoutDesign,
  filmDesign,
  exposurePS,
  proofing,
  printing,
  bookBinding,
  laminating,
  plastic,
  packing
}
