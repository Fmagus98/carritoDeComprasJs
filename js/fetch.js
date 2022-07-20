const API = "/js/stock.json";
 export const getData = async ()=>{
    const response = await fetch(API);
    const data= await response.json();
    return data
}
getData()