import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadSearchResults } from '../../actions/search';
import {
  List,
  Pagination,
  ProgressIndicator,
  SearchResult,
  SideNav
} from '../../components';

class SearchResultsPanel extends Component {

  constructor(props) {
    super(props);
    this.handleSelectPrevPage = this.handleSelectPrevPage.bind(this);
    this.handleSelectNextPage = this.handleSelectNextPage.bind(this);
  }

  componentDidMount() {
    this.props.loadSearchResults(this.props.params.query);
  }

  componentDidUpdate(prevProps) {
    const oldQuery = prevProps.params.query;
    const newQuery = this.props.params.query;

    if (newQuery !== oldQuery) {
      this.props.loadSearchResults(this.props.params.query);
    }
  }

  renderContent() {
    const { pagination } = this.props;
    const { isFetching, selectedPage } = pagination;
    const { total, results } = pagination[selectedPage] || {};

    if (isFetching) {
      return <ProgressIndicator />;
    }

    if (!total) {
      return <div>No results</div>;
    }

    const navItems = [
      { name: 'default', icon: 'dot-circle-o', tooltip: 'Search' },
      { name: 'yelp', icon: 'yelp', tooltip: 'Search Yelp' }
    ];

    const searchResults = results.map(this.renderSearchResult);

    return (
      <div className="search-results-panel__nav-container">
        <SideNav navItems={navItems} />
        <List items={searchResults} key="slug" />
      </div>
    );
  }

  renderFooter() {
    const { handleSelectPrevPage, handleSelectNextPage } = this;
    const { pagination } = this.props;
    const { prevPageUrl, nextPageUrl } = pagination;
    const hasPrev = !!prevPageUrl;
    const hasNext = !!nextPageUrl;

    return (
      <Pagination
        hasPrev={hasPrev}
        hasNext={hasNext}
        onSelectPrev={handleSelectPrevPage}
        onSelectNext={handleSelectNextPage}
      />
    );
  }

  renderSearchResult(searchResult) {
    return <SearchResult result={searchResult} />;
  }

  render() {

    return (
      <div className="search-results-panel">
        <div className="search-results-panel__search-bar-spacer"></div>
        <div className="search-results-panel__content">
          {this.renderContent()}
        </div>
        <div className="search-results-panel__footer">
          {this.renderFooter()}
        </div>
      </div>
    );
  }

  handleSelectPrevPage() {
    const { query } = this.props.params;
    const { pagination, loadSearchResults } = this.props;
    const { prevPageUrl } = pagination;

    loadSearchResults(query, prevPageUrl);
  }

  handleSelectNextPage() {
    const { query } = this.props.params;
    const { pagination, loadSearchResults } = this.props;
    const { nextPageUrl } = pagination;

    loadSearchResults(query, nextPageUrl);
  }

}

SearchResultsPanel.propTypes = {
  pagination: PropTypes.object,
  loadSearchResults: PropTypes.func.isRequired
};

SearchResultsPanel.defaultProps = {
  pagination: {}
};

function mapStateToProps(state, ownProps) {
  return {
    pagination: state.pagination.searchResults[ownProps.params.query]
  };
}

export default connect(mapStateToProps, { loadSearchResults })(SearchResultsPanel);
