import {FaSearch} from 'react-icons/fa'
import './index.css'

const FiltersGroup = props => {
  const {
    categoryOptions,
    ratingsList,
    changingCategory,
    changingRating,
    resetFunc,
    searchInput,
    onChangeSearchInput,
    onSearchKeyDown,
  } = props

  const clickingResetFilterBtn = () => {
    resetFunc()
  }

  return (
    <div className="filters-group-container">
      <div className="search-container">
        <input
          type="search"
          value={searchInput}
          onChange={onChangeSearchInput}
          onKeyDown={onSearchKeyDown}
          placeholder="Search"
          className="search-input"
        />
        <FaSearch />
      </div>
      <div>
        <ul className="category-container">
          <li>
            <h1 className="content-heading">Category</h1>
          </li>
          {categoryOptions.map(eachCategory => (
            <li key={eachCategory.categoryId}>
              <p
                className="category-item"
                onClick={() => changingCategory(eachCategory.categoryId)}
              >
                {eachCategory.name}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <ul className="ratings-container">
          <li className="content-heading">Rating</li>
          {ratingsList.map(eachRating => (
            <li key={eachRating.ratingId}>
              <button
                type="button"
                onClick={() => changingRating(eachRating.ratingId)}
                className="stars"
              >
                <img
                  className="rating-img"
                  src={eachRating.imageUrl}
                  alt={`rating ${eachRating.ratingId}`}
                />
                <p>& up</p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Clear Filters Button */}
      <div className="clear-filter-btn">
        <button type="button" onClick={clickingResetFilterBtn}>
          Clear Filters
        </button>
      </div>
    </div>
  )
}

export default FiltersGroup
