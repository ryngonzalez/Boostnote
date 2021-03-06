import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import ConfigTab from './ConfigTab'
import InfoTab from './InfoTab'
import StoragesTab from './StoragesTab'
import CSSModules from 'browser/lib/CSSModules'
import styles from './PreferencesModal.styl'

class Preferences extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      currentTab: 'STORAGES'
    }
  }

  componentDidMount () {
    this.refs.root.focus()
    const boundingBox = this.getContentBoundingBox()
    this.setState({ boundingBox })
  }

  switchTeam (teamId) {
    this.setState({currentTeamId: teamId})
  }

  handleNavButtonClick (tab) {
    return (e) => {
      this.setState({currentTab: tab})
    }
  }

  renderContent () {
    const { boundingBox } = this.state
    let { dispatch, config, data } = this.props

    switch (this.state.currentTab) {
      case 'INFO':
        return <InfoTab/>
      case 'CONFIG':
        return (
          <ConfigTab
            dispatch={dispatch}
            config={config}
          />
        )
      case 'STORAGES':
      default:
        return (
          <StoragesTab
            dispatch={dispatch}
            data={data}
            boundingBox={boundingBox}
          />
        )
    }
  }

  handleKeyDown (e) {
    if (e.keyCode === 27) {
      this.props.close()
    }
  }

  getContentBoundingBox () {
    const node = ReactDOM.findDOMNode(this.refs.content)
    return node.getBoundingClientRect()
  }

  render () {
    let content = this.renderContent()

    let tabs = [
      {target: 'STORAGES', label: 'Storages', icon: 'database'},
      {target: 'CONFIG', label: 'Config', icon: 'cogs'},
      {target: 'INFO', label: 'Info', icon: 'info-circle'}
    ]

    let navButtons = tabs.map((tab) => {
      let isActive = this.state.currentTab === tab.target
      return (
        <button styleName={isActive
            ? 'nav-button--active'
            : 'nav-button'
          }
          key={tab.target}
          onClick={(e) => this.handleNavButtonClick(tab.target)(e)}
        >
          <i styleName='nav-button-icon'
            className={'fa fa-' + tab.icon}
          />
          <span styleName='nav-button-label'>
            {tab.label}
          </span>
        </button>
      )
    })

    return (
      <div styleName='root'
        ref='root'
        tabIndex='-1'
        onKeyDown={(e) => this.handleKeyDown(e)}
      >
        <div styleName='nav'>
          {navButtons}
        </div>
        <div ref='content' styleName='content'>
          {content}
        </div>
      </div>
    )
  }
}

Preferences.propTypes = {
  dispatch: PropTypes.func
}

export default connect((x) => x)(CSSModules(Preferences, styles))
