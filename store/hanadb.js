const axios = require("axios");
var {
  store: { hanadb, sapSL },
} = require("../config");

async function list(data) {
  try {
    console.log(data);
    let condition = getCondition(data);

    let connection = hanadb.connect();

    let response =
      await connection.exec(`SELECT distinct T0."ItemCode" as "itemCode",
          'PATCH' AS "Method",
          T9."Ref1" as "shipment",
          T3."Currency" as "currency",
          T3."Price" as "price", 
          T3."Factor" as "factor",
          COALESCE(T10."Rate",OPDN."DocRate",T10."Rate") as "rate"
        
        FROM "${data.target.db}"."OITM" T0
        LEFT JOIN "${data.target.db}"."ITM1" T3 ON T0."ItemCode" = T3."ItemCode" AND T3."PriceList" = ${data.target.priceList}
        LEFT JOIN (SELECT EM."ItemCode" as "ItemCode", EM."Currency" AS "Currency", (EM."PriceAtWH") AS "PriceAtWH", EM."Rate",  EM."PriceFOB" ,  MO."Ref1"
                      FROM
                                   (SELECT MM."ItemCode", MAX(MM."DocEntry") "DocEntry", MAX(MO."DocDate") "DocDate",  MO."Ref1",  
                                   ROW_NUMBER() OVER (PARTITION BY MM."ItemCode" ORDER BY MM."ItemCode", MO."DocDate" DESC, MO."Ref1") AS "NumeroLinea"
                                FROM "${data.target.db}"."IPF1" MM
                                 INNER JOIN "${data.target.db}"."OIPF" MO ON MM."DocEntry" = MO."DocEntry"
                                 WHERE 1= 1
                                GROUP BY MM."ItemCode", MO."DocDate", MO."Ref1"
                                ORDER BY MM."ItemCode", MO."DocDate" DESC, MO."Ref1"
                                ) MM
                  INNER JOIN "${data.target.db}"."OIPF" MO ON MM."DocEntry" = MO."DocEntry"
                  INNER JOIN "${data.target.db}"."IPF1" EM ON MM."ItemCode" = EM."ItemCode" AND EM."DocEntry" = MM."DocEntry" 
                  WHERE MM."NumeroLinea" = 1 ) T9 ON T9."ItemCode" = T0."ItemCode"
         LEFT JOIN (SELECT CASE WHEN OPDN."DocCur" = 'DOP' THEN  T10a."Rate" ELSE OPDN."DocRate" END as "DocRate", OPDN."U_GB_Expediente" FROM "${data.target.db}"."OPDN" OPDN
                                         LEFT JOIN "${data.target.db}"."ORTT" T10a ON (T10a."RateDate" = OPDN."DocDate" AND T10a."Currency" = 'USD')) OPDN ON  OPDN."U_GB_Expediente" = T9."Ref1"
         LEFT JOIN "${data.target.db}"."ORTT" T10 ON (T10."RateDate" = CASE WHEN T9."PriceAtWH" IS NULL THEN T0."CreateDate" ELSE CURRENT_DATE END AND T10."Currency" = 'USD')
         WHERE 1 = 1  
         ${condition}
         --LIMIT 5000
         --AND T9."Ref1" LIKE '${data.value}'
         
         --AND T9."Ref1" IN ('AV00233')
          --and (LEFT(T0."ItemCode",3) IN ('Z49'))
        `);
    connection.disconnect();
    console.log("RES", response);
    let result = [];
    response.map((item) => {
      //let fIndex = item.URL.lastIndexOf(")") - 8;

      // console.log(item);
      result.push({
        method: item.Method,
        item: item.itemCode,
        //data: JSON.parse(item.Content).ItemPrices,
        price: item.price,
        currency: item.currency,
        shipment: item.shipment,
        rate: item.rate,
        factor: item.factor,
      });
    });

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function listAll() {
  let response = await axios(`${sapSL}/Items`);
}

function getCondition(data) {
  let condition = "";

  switch (data.field) {
    case "itemNum":
      condition = ` AND T0."ItemCode" LIKE '${data.value}'`;
      break;
    case "brandCode":
      condition = ` AND (LEFT(T0."ItemCode",3) IN ('${data.value}'))`;
      break;
    case "shipment":
      condition = `AND T9."Ref1"LIKE '${data.value}'`;
      break;
    default:
      break;
  }

  return condition;
}

async function update(data) {
  try {
    let result = {
      updated: [],
      fails: [],
    };

    let index = 0;

    for (item of data) {
      index++;
      console.log("THIS ITEM", item);
      let url = `${sapSL}/${item.routeParams}`;
      console.log("######################", item.content, index);
      await axios
        .patch(url, item.content, {
          headers: {
            "Content-Type": "application/json",
            Cookie: item.cookie,
          },
        })
        .then((updated) => {
          console.log(item.itemCode);
          result.updated.push(item.itemCode);
        })
        .catch((err) => {
          result.fails.push(item.itemCode);
          console.log(err.response.data.error.message);
        });
    }

    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  list,
  update,
};
