import React from "react";
import * as ReactDOMClient from 'react-dom/client';

import axios from 'axios';
import _ from 'lodash';

import imgLogo from './img/logo.png';
import imgCoffee from './img/coffee.png';

import './css/style.css';

const SERVER_URL = 'http://products-backend.nadot.ru';
const PRODUCTS_URL = '/products';

function Header() {
   return (
      <div className="header">
         <a class="no-border" href="/">
            <img className="header-logo" src={imgLogo} alt="Logo" />
         </a>
      </div>
   );
}

function CoffeeCup(props) {
   return (
      <div className="coffee">
         <a className="no-border" href="#">
            <img className="coffee-img" src={imgCoffee} alt="Coffee" />
         </a>
         <div className="coffee-name"><a href="#">{props.name}</a></div>
         <div className="coffee-price">100 RUB</div>
         <div className="coffee-delete">
            <a
               onClick={() => props.onDelete(props.id)}
               href="#"
            >
               Удалить
            </a>
         </div>
      </div>
   );
}

class App extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
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

      axios.get(SERVER_URL + PRODUCTS_URL)
         .then(function (response) {
            if (response.data.success == true) {
               self.setState({
                  products: _.values(response.data.products)
               });
            } else {
               alert('Не могу загрузить список продуктов');
            }
         })
         .catch(function (error) {
            console.log(error);
         });
   }

   showForm() {
      this.setState(prevState =>{
         return{
            showForm : !prevState.showForm
         }
      })
   }

   submitForm(event) {
      event.preventDefault();
      this.sendProduct(this.state.formProductName);
   }

   sendProduct(productName) {
      var self = this;

      axios.post(SERVER_URL + PRODUCTS_URL, {
         name: productName
      })
      .then(function (response) {
         if (response.data.success == true) {
            self.updateListProducts();
            document.getElementById("form-product-add").reset();
         } else {
            alert('Не могу добавить продукт');
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
         url: SERVER_URL + PRODUCTS_URL,
         data: {
           id: productId,
         }
       })
      .then(function (response) {
         if (response.data.success == true) {
            self.updateListProducts();
         } else {
            alert('Не могу удалить продукт');
         }
      })
      .catch(function (error) {
         console.log(error);
      });
   }

   render() {
      return (
         <div>
            <Header />
            <div className="container">
               <h1>Только лучший кофе!</h1>
               {this.state.products.map(product => ( 
                  <CoffeeCup
                     name={product.name}
                     key={product.id}
                     onDelete={() => this.removeProduct(product.id)}
                  />
               ))}
            </div>
            <div className="cl-b"></div>
            <div className="container container-form">
               <a className="dashed" onClick={this.showForm} href="#">
                  {!this.state.showForm && "Добавить кофе"}
                  {this.state.showForm && "Скрыть форму"}
               </a>
               {this.state.showForm &&
                  <div>
                     <form
                        id="form-product-add"
                        className="form-add"
                        onSubmit={this.submitForm}
                     >
                        <input
                           className="form-add-input"
                           type="text"
                           name="name"
                           defaultValue=""
                           onChange={this.handleChange}
                           placeholder="Введите название кофе"
                        />
                        <button>Добавить</button>
                     </form>
                  </div>
               }
            </div>
         </div>
      );
   }
}

const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement);
root.render(<App />);
