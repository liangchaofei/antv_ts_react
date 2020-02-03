import { Card, Divider } from 'antd';
import * as React from 'react';
import * as G2 from '@antv/g2';
interface UtilizationLineProps {
  height: number;
  type: string;
  id: number | string;
}
class UtilizationLine extends React.PureComponent<UtilizationLineProps> {
  chartContent = React.createRef<HTMLDivElement>();
  chart: any;
  state = {
    data: [
      {
        id: 1,
        month: '2019-01',
        count: 273996,
        actual_cost: 123333,
        cost: 234243,
      },
      {
        id: 2,
        month: '2019-02',
        count: 273296,
        actual_cost: 123233,
        cost: 234143,
      },
      {
        id: 3,
        month: '2019-03',
        count: 223996,
        actual_cost: 223333,
        cost: 134243,
      },
      {
        id: 4,
        month: '2019-04',
        count: 272996,
        actual_cost: 163333,
        cost: 231243,
      },
      {
        id: 5,
        month: '2019-05',
        count: 273396,
        actual_cost: 122333,
        cost: 214243,
      },
      {
        id: 6,
        month: '2019-06',
        count: 273936,
        actual_cost: 123343,
        cost: 234543,
      },
    ],
    width: 200,
    height: 200,
  };
  componentDidMount() {
    this.generateChart();
  }
  addCommas = (n: any) => {
    let reg = /\.\d+/;
    let num = (parseInt(n) || 0).toString();
    let temp = reg.exec(num);
    // 获取小数部分，不存在小数则获取空字符串
    let decimal = temp && temp[0] ? temp[0] : '';
    // 获取小数点位置，不存在小数位置则获取字符串长度
    let decimalPointIndex = temp && temp.index ? temp.index : num.length;
    // 获取整数部分
    let integerNum = num.slice(0, decimalPointIndex);
    let result = '';
    // 逗号分隔操作
    while (integerNum.length > 3) {
      result = ',' + integerNum.slice(-3) + result;
      integerNum = integerNum.slice(0, integerNum.length - 3);
    }
    // 不足3位直接加到最前面
    if (integerNum) {
      result = integerNum + result;
    }
    // 最后面加上小数部分
    result = result + decimal;
    return result;
  };
  generateChart = async () => {
    const { height = 300 } = this.props;
    const { data } = this.state;

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
      chart.source(data);

      chart.scale({
        cost: {
          alias: '预期',
        },
        actual_cost: {
          alias: '财务',
        },
        count: {
          alias: '数量',
          min: 0,
          max: 500000,
        },
        name: {
          type: 'cat',
        },
      });
      chart.axis('cost', {
        title: {
          // @ts-ignore
          text: '折旧(单位：元)',
        },
        label: {
          offset: 2,
          formatter: function formatter(val: any) {
            if (0 <= val && val < 10000) {
              return val;
            } else if (10000 <= val && val <= 1000000) {
              return (val / 10000).toFixed(0) + '万';
            } else if (1000000 <= val && val < 10000000) {
              return (val / 1000000).toFixed(0) + '百万';
            } else if (10000000 <= val && val < 100000000) {
              return (val / 10000000).toFixed(0) + '千万';
            } else if (100000000 <= val) {
              return (val / 100000000).toFixed(0) + '亿';
            }
          },
        },
      });
      chart.axis('actual_cost', false);
      chart.axis('count', {
        title: {},
        label: {
          offset: 2,
          formatter: function formatter(val: any) {
            if (0 <= val && val < 10000) {
              return val;
            } else if (10000 <= val && val <= 1000000) {
              return (val / 10000).toFixed(0) + '万';
            } else if (1000000 <= val && val < 10000000) {
              return (val / 1000000).toFixed(0) + '百万';
            } else if (10000000 <= val && val < 100000000) {
              return (val / 10000000).toFixed(0) + '千万';
            } else if (100000000 <= val) {
              return (val / 100000000).toFixed(1) + '亿';
            }
          },
        },
      });
      chart.axis('month', {
        label: {
          autoRotate: true,
        },
      });

      chart
        .interval()
        .position('month*count')
        .tooltip(`count*count`, (name: any, value: any) => {
          return {
            name: 'xx数量',
            value: `${this.addCommas(value)}`,
          };
        })
        .size(20);
      chart
        .line()
        .position('month*cost')
        .tooltip(`month*cost`, (name: any, value: any) => {
          return {
            name: '预期',
            value: `${this.addCommas(value)}`,
          };
        })
        .shape('smooth')
        .color('#2FC25B');
      chart
        .line()
        .position('month*actual_cost')
        .shape('smooth')
        .tooltip(`month*actual_cost`, (name: any, value: any) => {
          return {
            name: '实际',
            value: `${this.addCommas(value)}`,
          };
        })
        .color('#FACC14');
      chart.render();
    }
  };
  render() {
    return (
      <Card>
        <p>线和柱混合图</p>
        <div ref={this.chartContent} />
        <Divider />
      </Card>
    );
  }
}

export default UtilizationLine;
