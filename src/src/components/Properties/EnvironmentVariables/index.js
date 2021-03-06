import React from 'react'

import './styles.scss'
import DnComponent from '../../DnComponent'

const EnvironmentVariables = ({ group, options, dn }) => {
    return (
        <div className="EnvironmentVariables-wrapper p-40 overflow-hide">
            {dn && <div className="container-header">
                <DnComponent dn={dn}/>
                <h3>Environment Variables</h3>
            </div>}
            <div className="EnvironmentVariables-container">
                {group && Object.entries(group.config).map((item, index) => (
                    <div className="env-variable" key={index}>
                        <div className="name">
                            {item[0]}:
                        </div>
                        <div className="value" dangerouslySetInnerHTML={{ __html: item[1] }}/>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default EnvironmentVariables
