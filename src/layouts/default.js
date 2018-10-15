
import React from 'react';
import PropTypes from 'prop-types';

class DefaultLayout extends React.Component {
  getDescription() {
    return (
      <div>
        <div>
          This is an app which demonstrates cognitive framework for commercial web content
        </div>
      </div>
    );
  }

  render() {
    return (
      <html>
        <head>
          <title>Strategic Machines</title>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="og:title" content="Strategic Machines" />
          <meta name="og:description" content={this.props.description || 'Connecting Business to the Conversational Economy '} />
          <link rel="stylesheet" type="text/css" href="/css/application.css"/>
          <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"/>
          <link rel="icon" href="data:,"/>
        </head>
        <body>
          <main>{this.props.children}</main>
          <script
            type="text/javascript"
            id="bootstrap-data"
            dangerouslySetInnerHTML={{__html: `window.__INITIAL_STATE__ = ${this.props.initialData};`}}
          ></script>
          <script type="text/javascript" src="/js/bundle.js" />
        </body>
      </html>
    );
  }
}

DefaultLayout.propTypes = {
  hideHeader: PropTypes.bool,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
  initialData: PropTypes.string.isRequired
};

module.exports = DefaultLayout;
