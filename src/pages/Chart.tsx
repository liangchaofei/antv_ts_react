import { Card, Divider } from 'antd';
import * as React from 'react';
import * as G2 from '@antv/g2';
import DataSet from '@antv/data-set';
import { array } from 'prop-types';
interface UtilizationLineProps {
  height: number;
  type: string;
  id: number | string;
}
class UtilizationLine extends React.PureComponent<UtilizationLineProps> {
  chartContent = React.createRef<HTMLDivElement>();
  chart: any;
  state = {
    data: [ {
      "country": "as",
      "date": 1961,
      "value": 2
    }, {
      "country": "Jan",
      "date": 1962,
      "value": 1
    }, {
      "country": "Jan",
      "date": 1961,
      "value": 2
    },{
      "country": "as",
      "date": 1962,
      "value": 1
    }, {
      "country": "Jan",
      "date": 1963,
      "value": 3
    }, {
      "country": "as",
      "date": 1963,
      "value": 3
    }, {
      "country": "as",
      "date": 1966,
      "value": 7
    }, {
      "country": "Jan",
      "date": 1966,
      "value": 7
    },],
    width: 200,
    height: 200
  };
  componentDidMount() {
    this.generateChart();
  }
  unique = (arr: any[]) => {
    var hash = {};
    let arrData = arr.reduce(function (item, next) {
      hash[next.date] ? '' : hash[next.date] = true && item.push(next);
      return item
    }, [])
    return arrData;
  }
  generateChart = async () => {
    const { height = 300 } = this.props;
    const { data } = this.state;

    let obj = {};
    data.forEach(item=>{
      if(obj[item.date]){
        obj[item.date] += item.value
      }else{
        obj[item.date] = item.value
      }
    })
    data.map(item=>item.total = obj[item.date])
    console.log('aaa', data)

    if (this.chart) {
      this.chart.changeData(data);
      this.chart.repaint();
    } else {
      const chart = (this.chart = new G2.Chart({
        container: this.chartContent.current!,
        forceFit: true,
        padding: [20, 55, 60, 60],
        height,
      }));
      var ds = new DataSet();
      var dv = ds.createView().source(data);
      dv.transform({
        type: 'percent',
        field: 'value',
        dimension: 'country',
        groupBy: ['date'],
        as: 'percent'
      });
      chart.source(dv, {
        percent: {
          max: 1.0,
          min: 0.0,
          nice: false,
          formatter: function formatter(value: any) {
            value = value || 0;
            value = value * 100;
            return parseInt(value);
          }
        }
      });
      chart.scale('date', {
        range: [0, 1],
      });
      chartType1();
      chart.render();
      function chartType1() {
        chart.axis('date', {
          label: {
            textStyle: {
              fill: '#aaaaaa'
            }
          }
        });
        chart.axis('value', {
          label: {
            textStyle: {
              fill: '#aaaaaa'
            },
            formatter: function formatter(text) {
              return text.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            }
          }
        });
        chart.areaStack().position('date*value').color('country').opacity(0.7);
      }
    }
  };
  render() {
    return (
      <Card
      >
        <div ref={this.chartContent} />
        <Divider />


      </Card>
    );
  }
}

export default UtilizationLine;




