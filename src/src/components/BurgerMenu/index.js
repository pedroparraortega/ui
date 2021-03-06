import React, { useState } from 'react';
import './styles.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars,
    faFileDownload,
    faFileExport,
    faFileImport,
} from '@fortawesome/free-solid-svg-icons';
import cx from 'classnames'

const BurgerMenu = ({ type, service }) => {
    const [isMenuVisible, setIsMenuVisible] = useState(false)
    const [deleteExtra, setDeleteExtra] = useState(false)

    const exportItems = () => {
        service.backendExportItems(response => {
            const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(response))
            const exportElem = document.getElementById('exportAnchor')
            exportElem.setAttribute('href', dataStr)
            exportElem.setAttribute('download', `${response.kind}.json`)
            exportElem.click()
        })
    }

    const uploadFile = () => {
        const input = document.getElementById(`upload-${type}`)

        if (input.files.length === 0) {
            console.error('No file selected.');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const importData = {
                data: JSON.parse(reader.result),
                deleteExtra,
            };
            service.backendImportItems(importData, () => {
                input.value = null
            })
        };

        reader.readAsText(input.files[0]);
    }

    return (
        <div className="BurgerMenu-container" onMouseEnter={() => setIsMenuVisible(true)}
             onMouseLeave={() => setIsMenuVisible(false)}>

            <input type='file' id={`upload-${type}`} name={`upload-${type}`} onChange={() => uploadFile(type)} />

            <div className={cx('button-wrapper', { 'hovered': isMenuVisible })}>
                <FontAwesomeIcon icon={faBars} />
            </div>

            <div className={cx('menu', { 'hidden': !isMenuVisible })}>
                <a id='exportAnchor' style={{ display: 'none' }} />

                <div className="menu-item" onClick={() => exportItems()}>
                    <div className="icon">
                        <FontAwesomeIcon icon={faFileExport} />
                    </div>
                    Export {type}s
                </div>
                <div className="menu-item">
                    <label htmlFor={`upload-${type}`} onClick={() => setDeleteExtra(false)}>
                        <div className="icon">
                            <FontAwesomeIcon icon={faFileImport} />
                        </div>
                        Import {type}s
                    </label>
                </div>
                <div className="menu-item">
                    <label htmlFor={`upload-${type}`} onClick={() => setDeleteExtra(true)}>
                        <div className="icon">
                            <FontAwesomeIcon icon={faFileDownload} />
                        </div>
                        Replace {type}s
                    </label>
                </div>
            </div>
        </div>
    )
}

export default BurgerMenu
