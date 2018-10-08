
const React = require('react');
const PropTypes = require('prop-types');
const DefaultLayout = require('./layouts/default');
const Main = require('./main');

class Application extends React.Component {
  render() {
    const props = {}
    props.CONTEXT = "Commercial test site";      // pass in the web page title

    return (
      <DefaultLayout
        title={props.title}
        CONTEXT={props.CONTEXT}
        initialData={JSON.stringify(props)}
        hideHeader={Boolean(props.searchQuery)}
      >
        {/*<Main {...props} /> */}
        <Main  />
      </DefaultLayout>
    );
  }
}

Application.propTypes = {
  searchQuery: PropTypes.string,
};

module.exports = Application;