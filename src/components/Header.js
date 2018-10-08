import React from 'react';

class Header extends React.Component{
  render(){
    let {keyword, 
      handleSearchChange, 
      cartCount, 
      handleCartOpen, 
      isMobile, handleMobileSearch, 
      handleBackClick, 
      handleSearchSubmit} = this.props;
    return(
      <header className="header">
        <div className="main-title"><h1><i className="globe icon"></i> BookShop</h1></div>
        <div className={`search-form-container ${isMobile? 'search-form-active' : ''}`}>
          <div 
            className={`back-button ${isMobile? 'back-button-active': ''}`}
            onClick={handleBackClick}
          >
            <i className="fas fa-chevron-left"></i>
          </div>
          <form className="search-form" onSubmit={(e)=>handleSearchSubmit(e)}>
            <input type="text" value={keyword} placeholder="Search for Books..."  onChange={(e)=>handleSearchChange(e)}/>
          </form>
        </div>
        <div className="mobile-search" onClick={handleMobileSearch}>
          <i className="fas fa-search search-icon" ></i>
        </div>
        <div className="cart">
          <i className="shopping cart icon" onClick={handleCartOpen} >
            <span className="cart-count">&nbsp;{cartCount}</span>
          </i>

        </div>
      </header>
    )
  }
}

export default Header;