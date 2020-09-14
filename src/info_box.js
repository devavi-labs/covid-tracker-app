import React from 'react'
import {
    Card,
    CardContent,
    Typography
} from '@material-ui/core'
import './info_box.css'

function InfoBox({
    title,
    stat,
    total,
    active,
    isRed,
    ...props
}) {
    return (
        <Card
            onClick={props.onClick}
            className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'} `}
        >
            <CardContent>
                <Typography
                    className='infoBox__title'
                    color='textSecondary'
                >
                    {title}
                </Typography>
                <h2
                    className={`infoBox__stat ${!isRed && 'infoBox__stat--green'} `}
                >
                    {stat}
                </h2>
                <Typography
                    className='infoBox__total'
                    color='textSecondary'
                >
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
