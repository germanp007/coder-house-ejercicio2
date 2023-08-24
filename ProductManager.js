import fs from "fs";

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
  }
  async addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("Must fill all fields");
      return;
    }
    try {
      if (fs.existsSync(this.filePath)) {
        let productsJSON = await fs.promises.readFile(this.filePath, "utf-8");
        const productData = JSON.parse(productsJSON);
        if (productData.some((element) => element.code === code)) {
          console.log(`This code ${code} already exists, try another one`);
          return;
        }

        const newId = productData.length > 0 ? productData[productData.length - 1].id + 1 : 1;
        const newProduct = {
          id: newId,
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
        };
        productData.push(newProduct);
        await fs.promises.writeFile(
          "./productList.json",
          JSON.stringify(productData, null, 2)
        );
        console.log("Product Added");
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  async updateProduct(id, fields){
    try {
      const productList = await this.getProducts();
      const productIndex = productList.findIndex(ele => ele.id === id)
      if(productIndex === -1){
        console.log(`Product with ID ${id} not found`)
      }
      const productUpdated = {
        id,
        ...productList[productIndex],
        ...fields,
      }
      productList[productIndex] = productUpdated;
      await fs.promises.writeFile(this.filePath, JSON.stringify(productList, null,2))
      console.log('Product Updated')
    } catch (error) {
      console.log(error)
    }
  }
  async getProducts() {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = await fs.promises.readFile(this.filePath, "utf-8");
        const productList = JSON.parse(data);
        console.log(productList);
        return productList;
      }
    } catch (error) {
      console.log(error);
    }
  }
  async deleteProduct(id){
    
    try {
      const dataJSON = await this.getProducts()
      const productList = dataJSON.filter(ele => ele.id !== id)
      
      await fs.promises.writeFile(this.filePath, JSON.stringify(productList, null, 2))
      console.log('Product deleted')
    } catch (error) {
      console.log(error)
    }
    

  }
  async getProductById(id) {
    try {
      if (fs.existsSync(this.filePath)) {
        const productList = await this.getProducts();
        let product = productList.find((element) => element.id == id);
        if (product) {
          return product;
        } else {
          throw new Error("Product not found");
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}

const manager = new ProductManager("./productList.json");

await manager.updateProduct(2, {title: 'Adias',stock: 14});

(async ()=> {
    await manager.addProduct(
        "Converse",
        "Chuck Taylor",
        95,
        "./converse.jpg",
        "D133",
        14
      );

})()

