import { Card, Divider } from 'antd';
import * as React from 'react';
import * as G2 from '@antv/g2';
import DataSet from '@antv/data-set';
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
        month: '2019-01',
        aaaa_预期: 273996,
        aaaa_实际: 273996,
        bbbb_预期: 123333,
        bbbb_实际: 234243,
      },
      {
        month: '2019-02',
        aaaa_预期: 273196,
        aaaa_实际: 123333,
        bbbb_预期: 234443,
        bbbb_实际: 232143,
      },
      {
        month: '2019-03',
        aaaa_预期: 271296,
        aaaa_实际: 125233,
        bbbb_预期: 231143,
        bbbb_实际: 235143,
      },
      {
        month: '2019-04',
        aaaa_预期: 277296,
        aaaa_实际: 143233,
        bbbb_预期: 234133,
        bbbb_实际: 2341413,
      },
      {
        month: '2019-05',
        aaaa_预期: 2732961,
        aaaa_实际: 123233,
        bbbb_预期: 2341433,
        bbbb_实际: 234143,
      },
      {
        month: '2019-06',
        aaaa_预期: 2732963,
        aaaa_实际: 123233,
        bbbb_预期: 2341423,
        bbbb_实际: 234143,
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
  removeVal = (arr: any[], val: any) => {
    let index = arr.indexOf(val);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  };
  generateChart = async () => {
    const { height = 300 } = this.props;
    const { data } = this.state;

    let arr: any[] = [];
    data &&
      data[0] &&
      Object.keys(data[0]) &&
      Object.keys(data[0]).forEach((item: any) => {
        arr.push(item);
      });
    this.removeVal(arr, 'month');

    if (this.chart) {
    } else {
      var ds = new DataSet();
      var ages = arr;
      var dv = ds.createView();
      dv.source(data)
        .transform({
          type: 'fold',
          fields: ages,
          key: 'age',
          value: 'population',
          retains: ['month'],
        })
        .transform({
          type: 'map',
          callback: function callback(obj: any) {
            var key = obj.age;
            var type = '';
            if (key.includes('预期')) {
              type = 'a';
            } else {
              type = 'b';
            }
            obj.type = type;
            return obj;
          },
        });
      var colorMap = {};
      let goldColor = [
        '#fffbe6',
        '',
        '#fff1b8',
        '',
        '#ffe58f',
        '',
        '#ffd666',
        '',
        '#ffc53d',
        '',
        '#faad14',
      ];
      let blueColor = [
        '',
        '#e6f7ff',
        '',
        '#bae7ff',
        '',
        '#91d5ff',
        '',
        '#69c0ff',
        '',
        '#40a9ff',
        '',
        '#1890ff',
      ];
      arr.forEach((item: any, index: number) => {
        if (item.includes('预期')) {
          colorMap[item] = goldColor[index];
        } else {
          colorMap[item] = blueColor[index];
        }
      });
      const chart = (this.chart = new G2.Chart({
        container: this.chartContent.current!,
        forceFit: true,
        padding: [20, 55, 125, 60],
        height,
      }));
      chart.source(dv, {
        population: {},
      });
      chart.axis('population', {
        label: {
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
      chart
        .interval()
        .position('month*population')
        .color('age', function(age: any) {
          return colorMap[age];
        })
        // .tooltip('age*population', function (age: any, population: any) {
        //     return {
        //         name: age,
        //         value: `${this.addCommas(population)}`,
        //     };
        // })
        .adjust([
          {
            type: 'dodge',
            dodgeBy: 'type', // 按照 type 字段进行分组
            marginRatio: 0, // 分组中各个柱子之间不留空隙
          },
          {
            type: 'stack',
          },
        ]);
      chart.render();
    }
  };
  render() {
    return (
      <Card>
        <p>双柱状折叠图</p>
        <div ref={this.chartContent} />
        <Divider />
      </Card>
    );
  }
}

export default UtilizationLine;
