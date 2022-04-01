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

      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleChange = this.handleChange.bind(this);
   }

   componentDidMount() {
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

   handleSubmit(event) {
      event.preventDefault();
      this.sendProduct(this.state.formProductName);
   }

   sendProduct(productName) {
      axios({
         method: 'post',
         url: 'http://test.nadot.ru/products',
         data: {
            name: productName
         },
         headers: { "Content-Type": "multipart/form-data" },
      })
      .then(function (response) {
         console.log(response);
      })
      .catch(function (error) {
         console.log(error);
      });
   }

   handleChange(event) {
      this.setState({ formProductName: event.target.value });
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
                  <li key={product.id}>{product.name}</li>
               ))}
            </ul>
            <a onClick={this.showForm} href="#add">Добавить продукт</a>
            {this.state.showForm &&
               <div>
                  <form onSubmit={this.handleSubmit}>
                     <label>
                        Название:
                        <input type="text" name="name" defaultValue="" onChange={this.handleChange} placeholder="Введите название товара" />
                     </label>
                     <button>Добавить</button>
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
