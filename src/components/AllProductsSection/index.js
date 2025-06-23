import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {name: 'Clothing', categoryId: '1'},
  {name: 'Electronics', categoryId: '2'},
  {name: 'Appliances', categoryId: '3'},
  {name: 'Grocery', categoryId: '4'},
  {name: 'Toys', categoryId: '5'},
]

const sortbyOptions = [
  {optionId: 'PRICE_HIGH', displayText: 'Price (High-Low)'},
  {optionId: 'PRICE_LOW', displayText: 'Price (Low-High)'},
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllProductsSection extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productsList: [],
    activeOptionId: sortbyOptions[0].optionId,
    activeCategoryId: '',
    activeTitleSearch: '',
    activeRating: '',
    hasProduct: false,
  }

  componentDidMount() {
    this.getProducts()
  }

  handleSearchInput = event => {
    const {value} = event.target
    this.setState({activeTitleSearch: value})
  }

  handleSearchKeyDown = event => {
    if (event.key === 'Enter') {
      this.getProducts()
    }
  }

  resetFunc = () => {
    this.setState(
      {
        activeCategoryId: '',
        activeTitleSearch: '',
        activeRating: '',
        activeOptionId: sortbyOptions[0].optionId,
      },
      this.getProducts,
    )
  }

  changingCategory = id => {
    this.setState({activeCategoryId: id}, this.getProducts)
  }

  changingRating = id => {
    this.setState({activeRating: id}, this.getProducts)
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  getProducts = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {activeOptionId, activeCategoryId, activeTitleSearch, activeRating} =
      this.state

    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategoryId}&title_search=${activeTitleSearch}&rating=${activeRating}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    try {
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const fetchedData = await response.json()
        const updatedData = fetchedData.products.map(product => ({
          title: product.title,
          brand: product.brand,
          price: product.price,
          id: product.id,
          imageUrl: product.image_url,
          rating: product.rating,
        }))

        this.setState({
          productsList: updatedData,
          apiStatus: apiStatusConstants.success,
          hasProduct: updatedData.length === 0,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  noProductView = () => (
    <div className="no-products-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        alt="no products"
      />
      <h1>No Products Found</h1>
      <p>We could not find any products. Try other filters.</p>
    </div>
  )

  renderProductsList = () => {
    const {productsList, activeOptionId, hasProduct} = this.state

    if (hasProduct) {
      return this.noProductView()
    }

    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="products-error-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We are having some trouble processing your request.</p>
      <p>Please try again.</p>
    </div>
  )

  renderLoader = () => (
    <div className="products-loader-container" aria-label="Loading products">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderApiStatusView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderProductsList()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {productsList, activeTitleSearch} = this.state

    return (
      <div className="all-products-section">
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          changingCategory={this.changingCategory}
          changingRating={this.changingRating}
          productsList={productsList}
          searchInput={activeTitleSearch}
          onChangeSearchInput={this.handleSearchInput}
          onSearchKeyDown={this.handleSearchKeyDown}
          resetFunc={this.resetFunc}
        />

        {this.renderApiStatusView()}
      </div>
    )
  }
}

export default AllProductsSection
