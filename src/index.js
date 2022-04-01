import React from "react";
import * as ReactDOMClient from 'react-dom/client';

import axios from 'axios';
import _ from 'lodash';

class App extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         error: false,
         products: [],
         showForm: false,
         formProductName: ''
      };

      this.showForm = this.showForm.bind(this);

      this.submitForm = this.submitForm.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.removeProduct = this.removeProduct.bind(this);
   }

   componentDidMount() {
      this.updateListProducts();
   }

   updateListProducts() {
      var self = this;

      axios.get('http://test.nadot.ru/products')
         .then(function (response) {
            if (response.data.success == true) {
               self.setState({
                  products: _.values(response.data.products)
               });
            } else {
               self.setState({
                  error: true
               });
            }
         })
         .catch(function (error) {
            console.log(error);
         });
   }

   showForm() {
      this.setState({ showForm: true });
   }

   submitForm(event) {
      event.preventDefault();
      this.sendProduct(this.state.formProductName);
   }

   sendProduct(productName) {
      var self = this;

      axios.post('http://test.nadot.ru/products', {
         name: productName
      })
      .then(function (response) {
         if (response.data.success == true) {
            self.updateListProducts();
            document.getElementById("form-product-add").reset();
         } else {
            alert('Cannot adding a product');
         }
      })
      .catch(function (error) {
         console.log(error);
      });
   }

   handleChange(event) {
      this.setState({ formProductName: event.target.value });
   }

   removeProduct(productId) {
      var self = this;

      axios({
         method: 'DELETE',
         url: 'http://test.nadot.ru/products',
         data: {
           id: productId,
         }
       })
      .then(function (response) {
         if (response.data.success == true) {
            self.updateListProducts();
         } else {
            alert('Cannot delete a product');
         }
      })
      .catch(function (error) {
         console.log(error);
      });
   }

   render() {
      return (
         <div>
            <h1>Products</h1>

            {this.state.error &&
               <div>
                  <p>Error</p>
               </div>
            }
            <ul>
               {this.state.products.map(product => (  
                  <li key={product.id}>{product.name} <a onClick={() => this.removeProduct(product.id)} href="#del">Delete</a></li>
               ))}
            </ul>
            <a onClick={this.showForm} href="#add">Add product</a>
            {this.state.showForm &&
               <div>
                  <form id="form-product-add" onSubmit={this.submitForm}>
                     <label>
                        Name:
                        <input type="text" name="name" defaultValue="" onChange={this.handleChange} placeholder="Enter a product name" />
                     </label>
                     <button>Send</button>
                  </form>
               </div>
            }
         </div>
      );
   }
}

const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement);
root.render(<App />);
