import { useEffect, useState } from "react";
import "./style.css";
import Data from "./data.json";

type classObjType = {
  value: (number | string)[];
  gamma: number[];
  valueMean?: number;
  gammaMean?: number;
  valueMedian?: number;
  gammaMedian?: number;
  valueMode?: number;
  gammaMode?: number;
};

function App() {
  const [classData, setClassData] = useState<{ [key: number]: classObjType }>(
    {}
  );
  const roundOffNumber = (num: number): number => {
    return Math.round(num * 1000) / 1000;
  };
  useEffect(() => {
    const classwiseObj: { [key: number | number]: classObjType } = {};
    let data: any[] = Data;

    data.map((item) => {
      const gamma = roundOffNumber((item.Ash * item.Hue) / item.Magnesium);
      if (!classwiseObj[item.Alcohol]) {
        classwiseObj[item.Alcohol] = {
          value: [item.Flavanoids],
          gamma: [gamma]
        };
      } else {
        classwiseObj[item.Alcohol].value.push(item.Flavanoids);
        classwiseObj[item.Alcohol].gamma.push(gamma);
      }
    });
    Object.keys(classwiseObj).map((key) => {
      let { value, gamma } = classwiseObj[key];
      value = value.sort();
      gamma = gamma.sort();

      let valueSum = value.reduce(
        (a: number, b: number) => Number(a) + Number(b),
        0
      );
      let gammaSum = gamma.reduce(
        (a: number, b: number) => Number(a) + Number(b),
        0
      );

      classwiseObj[key]["valueMean"] = roundOffNumber(valueSum / value.length);
      classwiseObj[key]["gammaMean"] = roundOffNumber(gammaSum / gamma.length);
      if (value.length % 2 === 0) {
        classwiseObj[key]["valueMedian"] = roundOffNumber(
          (value[value.length / 2 - 1] + value[value.length / 2]) / 2
        );
        classwiseObj[key]["gammaMedian"] = roundOffNumber(
          (gamma[gamma.length / 2 - 1] + gamma[gamma.length / 2]) / 2
        );
      } else {
        classwiseObj[key]["valueMedian"] = roundOffNumber(
          value[(value.length + 1) / 2 - 1]
        );
        classwiseObj[key]["gammaMedian"] = roundOffNumber(
          gamma[(gamma.length + 1) / 2 - 1]
        );
      }
      let hashValue = new Map<number, number>();
      let hashGamma = new Map<number, number>();
      for (let i = 0; i < value.length; i++) {
        if (hashValue.has(value[i]))
          hashValue.set(value[i], (hashValue.get(value[i]) ?? 0) + 1);
        else hashValue.set(value[i], 1);
      }
      for (let i = 0; i < gamma.length; i++) {
        if (hashGamma.has(gamma[i]))
          hashGamma.set(gamma[i], (hashGamma.get(gamma[i]) ?? 0) + 1);
        else hashGamma.set(gamma[i], 1);
      }
      let maxCountValue = 0;
      let resValue = -1;
      let maxCountGamma = 0;
      let resGamma = -1;
      hashValue.forEach((val, key) => {
        if (maxCountValue < val) {
          resValue = key;
          maxCountValue = val;
        }
      });
      hashGamma.forEach((val, key) => {
        if (maxCountGamma < val) {
          resGamma = key;
          maxCountGamma = val;
        }
      });
      classwiseObj[key]["valueMode"] = resValue;
      classwiseObj[key]["gammaMode"] = resGamma;
    });
    setClassData(classwiseObj);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          Table 1
          <table>
            <tr>
              <th className="Value">Measure</th>
              {classData &&
                Object.keys(classData).map((type) => (
                  <th key={type} className="Value">
                    Class {type}
                  </th>
                ))}
            </tr>
            <tr>
              <td className="Value">Flavanoids Mean</td>
              {classData &&
                Object.keys(classData).map((type) => (
                  <td key={type} className="Value">
                    {classData[type]?.valueMean}
                  </td>
                ))}
            </tr>
            <tr>
              <td className="Value">Flavanoids Median</td>
              {classData &&
                Object.keys(classData).map((type) => (
                  <td key={type} className="Value">
                    {classData[type]?.valueMedian}
                  </td>
                ))}
            </tr>
            <tr>
              <td className="Value">Flavanoids Mode</td>
              {classData &&
                Object.keys(classData).map((type) => (
                  <td key={type} className="Value">
                    {classData[type]?.valueMode}
                  </td>
                ))}
            </tr>
          </table>
        </div>
        <div>
          Table 2
          <table>
            <tr>
              <th className="Value">Measure</th>
              {classData &&
                Object.keys(classData).map((type) => (
                  <th key={type} className="Value">
                    Class {type}
                  </th>
                ))}
            </tr>
            <tr>
              <td className="Value">Gamma Mean</td>
              {classData &&
                Object.keys(classData).map((type) => (
                  <td key={type} className="Value">
                    {classData[type]?.gammaMean}
                  </td>
                ))}
            </tr>
            <tr>
              <td className="Value">Gamma Median</td>
              {classData &&
                Object.keys(classData).map((type) => (
                  <td key={type} className="Value">
                    {classData[type]?.gammaMedian}
                  </td>
                ))}
            </tr>
            <tr>
              <td className="Value">Gamma Mode</td>
              {classData &&
                Object.keys(classData).map((type) => (
                  <td key={type} className="Value">
                    {classData[type]?.gammaMode}
                  </td>
                ))}
            </tr>
          </table>
        </div>
      </header>
    </div>
  );
}

export default App;
