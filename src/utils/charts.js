import React, {Component}  from 'react';
import { AreaChart, Area, YAxis } from 'recharts';


class ChartsArea extends Component {

    render() {
        const {upsAndDowns, data} = this.props;

        return (
            <div>
                <div className='txt-s color-darken50 px24'>
                    <svg className='icon inline-block align-middle'><use xlinkHref='#icon-arrow-up'></use></svg>{upsAndDowns[0]}m -
                    <svg className='icon inline-block align-middle'><use xlinkHref='#icon-arrow-down'></use></svg>{upsAndDowns[1]}m
                </div>
                <AreaChart width={240} margin={{ top: 0, right: 12, left: 12, bottom: 12 }} height={100} data={data}>
                    <YAxis orientation="right" />
                    <Area type="monotone" dataKey="e" stroke="#2abaf7" fill='#2abaf7' fillOpacity={0.5} strokeWidth={2} dot={null} />
                </AreaChart>
            </div>
        )
    }
}

export default ChartsArea;