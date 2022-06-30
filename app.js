const fs = require('fs');
const http=require('http');
const url  = require('url');

const productCard=fs.readFileSync('./templates/template-card.html','utf-8');
const productOverview=fs.readFileSync('./templates/template-overview.html','utf-8');
const productTemplate=fs.readFileSync('./templates/template-product.html','utf-8');
const data=fs.readFileSync('data.json','utf-8');
const DataObj=JSON.parse(data)

const replaceTemplate=(temp,product)=>{
    let output=temp.replace(/{%PRODUCTNAME%}/g,product.productName)
    
    output=output.replace(/{%IMAGE%}/g,product.image)
    output=output.replace(/{%PRICE%}/g,product.price)
    output=output.replace(/{%FROM%}/g,product.from)
    output=output.replace(/{%NUTRIENTS%}/g,product.nutrients)
    output=output.replace(/{%DESCRIPTION%}/g,product.description)
    output=output.replace(/{%QUANTITY%}/g,product.quantity)

    output=output.replace(/{%ID%}/g,product.id)
    if(!product.organic){
    output=output.replace(/{%NOT_ORGANIC%}/g,'not-organic')
    }
// console.log(output)
    return output;


}

const server=http.createServer((req,res)=>{
   

    
    const {query,pathname}=(url.parse(req.url,true))

    if(pathname=='/' || pathname=='/overview'){
        res.writeHead(200,{'Content-type':'text/html'})

        const CardsHtml=DataObj.map(el=>replaceTemplate(productCard,el)).join('');
        output=productOverview.replace('{%PRODUCT_CARDS%}',CardsHtml);

            res.end(output)
    }else if(pathname=='/product'){

            
        
            res.writeHead(200,{'Content-type':'text/html'})
            const product=DataObj[query.id]
            const output=replaceTemplate(productTemplate,product)

            res.end(output)
         }else{
        res.writeHead(404,{
            'Content-type':'text/html',
            'my-own-header':'New-error'
        })
        res.end('<h1>Page not found</h1>')
    }
})

server.listen(8080,'127.0.0.1',()=>{
    console.log('Listening to port 8080')
})