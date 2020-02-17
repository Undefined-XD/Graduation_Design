// 纸类型/吨的价钱
const priceObj = {
  artPaper128: 6800,
  artPaper200: 6800,
  kraftPaper: 1.5
}

// 用纸损耗率
const scrapRateObj = {
  artPaper128: 0.018,
  artPaper200: 0.072
}

// 纸张规格相关信息
const paperDataObj = {
  // 封面纸张信息
  cover: {
    // 总册数
    albums: 0,
    // 总页数
    pages: 0,
    // 总开数
    foldTimes: 0,
    // 纸张类型
    paperType: 'artPaper200',
    // 印张
    printedSheets: 0,
    // 全开纸/册
    fullPaperPerAlbum: 0,
    // 全开纸总数
    usedFullPapers: 0,
    // 实际用纸量: 全张纸总数 + 损耗用纸
    actualUsedFullPapers: 0
  },
  // 内文纸张信息
  content: {
    // 总册数
    albums: 0,
    // 总页数
    pages: 0,
    // 总开数
    foldTimes: 0,
    // 纸张类型
    paperType: 'artPaper128',
    // 印张
    printedSheets: 0,
    // 全开纸/册
    fullPaperPerAlbum: 0,
    // 全开纸总数
    usedFullPapers: 0,
    // 实际用纸量: 全张纸总数 + 损耗用纸
    actualUsedFullPapers: 0
  },
  classAPaperArea: 0.889 * 1.194,
  // 开机费
  machineCost: 650,
  // 折页、配页、锁线装订费单价
  bookBinding: 0.06
}

/**
 * 计算某一纸张类型的单价
 * @param {string} paperType 纸张类型
 */
function unitPrice (paperType = 'artPaper128') {
  // 一张大度全开纸的面积
  const classAPaperArea = 0.889 * 1.194
  // 一张大度全开纸的重量
  const classAPaperWeight = classAPaperArea * (paperType.replace(/[a-zA-Z]+/, ''))
  // 一张大度全开(铜板)纸的价格
  const singlePaperCost = classAPaperWeight / 1000000 * priceObj[paperType]

  return singlePaperCost.toFixed(2)
}

/**
 * 计算封面/内文纸张成本
 * @param {number} albums 总册数
 * @param {string} pages 总页数
 * @param {number} foldTimes 开数
 * @param {string} paperType 纸张类型
 * @param {string} paperFace 纸面: 正/反面
 */
function paperCost (albums, pages, foldTimes, paperType = 'artPaper128', paperFace) {
  // 印张
  const printedSheets = pages / foldTimes
  // 全开纸/册
  const fullPaperPerAlbum = printedSheets / 2
  // 全开纸总数
  const usedFullPapers = fullPaperPerAlbum * albums
  // 实际用纸量(全开纸总数 + 额外损耗总数)
  const actualUsedFullPapers = usedFullPapers * (1 + scrapRateObj[paperType])

  paperDataObj[paperFace] = {
    albums,
    pages,
    foldTimes,
    paperType,
    printedSheets,
    fullPaperPerAlbum,
    usedFullPapers,
    actualUsedFullPapers
  }

  return actualUsedFullPapers * unitPrice(paperType)
}

/**
 * 计算内文纸张成本
 * @param {number} albums 总册数
 * @param {string} pages 总页数
 * @param {number} foldTimes 开数
 * @param {string} paperType 纸张类型
 */
function contentCost (albums, pages, foldTimes, paperType = 'artPaper128') {
  return paperCost(albums, pages, foldTimes, paperType, 'content')
}

/**
 * 计算封面纸张成本
 * @param {number} albums 总册数
 * @param {string} pages 总页数
 * @param {number} foldTimes 开数
 * @param {string} paperType 纸张类型
 */
function coverCost (albums, pages, foldTimes, paperType = 'artPaper200') {
  return paperCost(albums, pages, foldTimes, paperType, 'cover')
}

/**
 * 计算设计制作费用
 * @param {number} foldTimes 开数
 * @param {number} designUnitPrice 每页设计单价
 * @param {number} filmUnitPrice 出胶片单价
 * @param {number} psUnitPrice 晒ps版单价
 * @param {number} contentPages 内容页数
 * @param {number} coverPages 封面页数
 */
function designCost (foldTimes, designUnitPrice, filmUnitPrice, psUnitPrice, contentPages, coverPages = 4) {
  // 设计制作费: 内容页数 + 封面页数(4)
  const designCost = (contentPages + coverPages) * designUnitPrice
  // 出胶片费用: 内容页数 + 封面页数(4)
  const filmCost = (contentPages + coverPages) * filmUnitPrice
  // 晒 ps 版费用：所需印版数 = 印张 * 8(正反面各4色) + 4(封面自翻版4张)
  const psCost = ((contentPages / foldTimes) * 8 + 4) * psUnitPrice

  return {
    designCost,
    filmCost,
    psCost
  }
}

/**
 * 计算打样费用
 * @param {number} pages 总页数
 * @param {number} unitPrice 单价
 */
function proofCost (pages, unitPrice) {
  // 内容页数 + 封面页数(4)
  return (pages + 4) * unitPrice
}

/**
 * 计算印刷费用
 * @param {number} actualUsedFullPapers 实际所需全开纸张总数
 * @param {number} colorReamUnitPrice 色令单价
 */
function printingCost (actualUsedFullPapers, colorReamUnitPrice) {
  // 实际所需全开纸总数 / 500(五百张全开纸为一千印) * 色令单价 * 色数 * 正反两面
  return actualUsedFullPapers / 500 * colorReamUnitPrice * 4 * 2
}

/**
 * 计算封面印刷费用
 * @param {number} actualUsedFullPapers 实际所需全开纸数量
 * @param {number} colorReamUnitPrice 色令单价
 */
function coverPrintingCost (actualUsedFullPapers, colorReamUnitPrice) {
  const cost = printingCost(actualUsedFullPapers, colorReamUnitPrice)
  return cost > paperDataObj.machineCost ? cost : paperDataObj.machineCost
}

/**
 *  计算内文印刷费用
 * @param {number} actualUsedFullPapers 实际所需全开纸数量
 * @param {number} colorReamUnitPrice 色令单价
 */
function contentPrintCost (actualUsedFullPapers, colorReamUnitPrice) {
  const cost = printingCost(actualUsedFullPapers, colorReamUnitPrice)
  return cost > paperDataObj.machineCost ? cost : paperDataObj.machineCost
}

/**
 * 折页、配页、装订单价
 * @param {number} bookBindingUnitPrice 折页、配页、装订单价
 */
function bookBinding (bookBindingUnitPrice) {
  // 册数 * 印张/册 * 装订单价
  return paperDataObj.content.albums * paperDataObj.content.printedSheets * bookBindingUnitPrice
}

/**
 * 计算封面覆膜费用
 * @param {number} usedFullPapers 封面所用全开纸总数
 * @param {number} laminatingUnitPrice 覆膜单价
 */
function laminating (usedFullPapers, laminatingUnitPrice) {
  // 封面所用全开纸总数 * 全开纸覆膜面积 * 覆膜单价
  return usedFullPapers * paperDataObj.classAPaperArea * laminatingUnitPrice
}

/**
 * 计算胶装、上封面费用
 * @param {number} addhesiveUnitPrice 胶装单价
 */
function addhesive (addhesiveUnitPrice) {
  // 胶装按印张数量收费，一个封面等于两个印张
  // 总印张 = 内文印张数量 + 一个封面（相当于两个印张）
  const totalPrintedSheets = paperDataObj.content.printedSheets + 2

  // 单册印张总数 * 印张胶装单价 * 总册数
  return totalPrintedSheets * addhesiveUnitPrice * paperDataObj.content.albums
}

/**
 * 计算打包费用
 * @param {string} packingPaper 包装纸类型
 * @param {number} albumsPerPackage n 册/包
 */
function packageCost (packingPaper, albumsPerPackage) {
  // 总册数 / 客户要求的册数/包
  const packages = paperDataObj.content.albums / albumsPerPackage
  // 总包数 * 牛皮纸单价
  return packages * priceObj[packingPaper]
}

/**
 * 计算税金
 * @param {number} processCost 加工费用
 * @param {number} texRate 税率 13% || 16%
 */
function texCost (processCost, texRate = 0.16) {
  return processCost * texRate
}
