import { expect } from "chai";
import Circle from "@/components/Circle/Circle.vue";
import Gradient from "@/components/Gradient.vue";
import { factory } from "@/../tests/helper";

const localFactory = (props) => factory({ container: Circle, props });

const colorAsStringTests = (colorProp, color, selector, fill = false, half) => {
  describe("applies color as string", () => {
    const wrapper = localFactory({ ...colorProp, half });
    const circleWrapper = wrapper.find(selector);

    it("do not recognize gradient colors", () => {
      const type = selector.includes("empty") ? "EmptyColor" : "Color";
      const fillType = fill ? "Fill" : "";
      expect(wrapper.vm[`is${type}${fillType}Gradient`]).to.be.false;
    });

    it("do not renders Gradient component", () => {
      expect(wrapper.findComponent(Gradient).exists()).to.be.false;
    });

    it("applies color correctly to SVG stroke", () => {
      expect(circleWrapper.element.getAttribute(`${fill ? "fill" : "stroke"}`)).to.equal(`${color}`);
    });
  });
};

const linePositionTests = (linePositionProp, selector, half = false, empty = false) => {
  describe("linePosition.mode", () => {
    describe("linePosition.mode.center", () => {
      const thickness = 10;
      const wrapper = localFactory({ ...linePositionProp, half, thickness, emptyThickness: thickness });
      const fillCircleWrapper = wrapper.find(selector);

      it("calculations the radius correctly", () => {
        const expectedRadius = (empty ? wrapper.vm.emptyRadius : wrapper.vm.radius) - thickness / 2;
        const radius = fillCircleWrapper.element.getAttribute("r");
        expect(radius).to.equal(`${expectedRadius}`);
      });
    });

    it("does not render the fill circle by default", () => {
      expect(localFactory({ half }).find(selector).exists()).to.be.false;
    });

    it("does not render the fill circle with 'transparent' color", () => {
      expect(localFactory({ half }).find(selector).exists()).to.be.false;
    });

    it("renders Gradient component", () => {
      expect(wrapper.findComponent(Gradient).exists()).to.be.true;
    });
    it(`applies gradient URL to SVG ${fill ? "fill" : "stroke"}`, () => {
      expect(fillCircleWrapper.element.getAttribute(`${fill ? "fill" : "stroke"}`)).to.equal(
        `url(#${gradientURLPrefix}-gradient-${id})`
      );
    });
    it("renders corresponding amount of stop colors SVG elements", () => {
      expect(stopColorWrappers.length).to.equal(gradientColor.colors.length);
    });
    for (let i = 0; i < stopColorWrappers.length; i++) {
      it("applies opacity correctly to each stop color SVG element", () => {
        expect(stopColorWrappers[i].element.getAttribute("stop-opacity")).to.equal(
          `${gradientColor.colors[i].opacity}`
        );
      });
      it("applies color correctly to each stop color SVG element", () => {
        expect(stopColorWrappers[i].element.getAttribute("stop-color")).to.equal(`${gradientColor.colors[i].color}`);
      });
      it("applies offset correctly to each stop color SVG element", () => {
        expect(stopColorWrappers[i].element.getAttribute("offset")).to.equal(`${gradientColor.colors[i].offset}%`);
      });
    }
  });
};

const colorTests = (colorProp, half = false, empty = false, gradientURLPrefix) => {
  const circleClassPrefix = `ep-${half ? "half-" : ""}circle--`;
  const circleClassPostfix = `${empty ? "empty" : "progress"}`;
  const circleSelector = `.${circleClassPrefix}${circleClassPostfix}__fill`;

  colorAsStringTests({ [colorProp]: color }, color, circleSelector, false, half);
  linePositionTests({ [colorProp]: gradientColor }, circleSelector, gradientURLPrefix, false, half);
};

const colorFillTests = (colorProp, half = false, empty = false, gradientURLPrefix) => {
  const circleClassPrefix = `ep-${half ? "half-" : ""}circle--`;
  const circleClassPostfix = `${empty ? "empty" : "progress"}__fill`;
  const circleSelector = `.${circleClassPrefix}${circleClassPostfix}`;

  const color = "#ff0020";

  it("renders fill circle", () => {
    expect(
      localFactory({ [colorProp]: color, half })
        .find(circleSelector)
        .exists()
    ).to.be.true;
  });

  colorAsStringTests({ [colorProp]: color }, color, circleSelector, true, half);
  linePositionTests({ [colorProp]: gradientColor }, circleSelector, gradientURLPrefix, true, half);
};

describe("Colors", () => {
  describe("Circle", () => {
    const half = false;
    describe("#color", () => {
      colorTests("color", half, false, "ep-progress");
    });
    describe("#emptyColor", () => {
      colorTests("emptyColor", half, true, "ep-empty");
    });
    describe("#colorFill", () => {
      colorFillTests("colorFill", half, false, "ep-progress-fill");
    });
    describe("#emptyColorFill", () => {
      colorFillTests("emptyColorFill", half, true, "ep-empty-fill");
    });
  });
  describe("Half Circle", () => {
    const half = true;
    describe("#color", () => {
      colorTests("color", half, false, "ep-progress");
    });
    describe("#emptyColor", () => {
      colorTests("emptyColor", half, true, "ep-empty");
    });
    describe("#colorFill", () => {
      colorFillTests("colorFill", half, false, "ep-progress-fill");
    });
    describe("#emptyColorFill", () => {
      colorFillTests("emptyColorFill", half, true, "ep-empty-fill");
    });
  });
});
