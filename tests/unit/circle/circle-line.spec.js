import { expect } from "chai";
import { mount } from "@vue/test-utils";
import Container from "../../../src/components/VueEllipseProgress.vue";
import Circle from "../../../src/components/Circle/CircleProgress.vue";

// const wait = (ms = 400) => new Promise(resolve => setTimeout(() => resolve(), ms));

const compareRadiusValues = (circleWrapper, expectedProgressCircleRadius, expectedEmptyCircleRadius) => {
  const circleProgressWrapper = circleWrapper.find("circle.ep-circle--progress");
  const circleEmptyWrapper = circleWrapper.find("circle.ep-circle--empty");

  const progressCircleRadius = circleProgressWrapper.element.getAttribute("r");
  const emptyCircleRadius = circleEmptyWrapper.element.getAttribute("r");

  expect(progressCircleRadius).to.equal(`${expectedProgressCircleRadius}`);
  expect(emptyCircleRadius).to.equal(`${expectedEmptyCircleRadius}`);
};

const factory = propsData => {
  return mount(Container, {
    propsData: {
      ...propsData
    },
    stubs: {
      CountUp: true
    }
  });
};

export default () => {
  describe("#line", () => {
    it("renders line type correctly", async () => {
      const progress = 60;
      const line = "round";

      const wrapper = factory({
        progress,
        line
      });
      const circleWrapper = wrapper.find(Circle);
      const circleProgressWrapper = circleWrapper.find("circle.ep-circle--progress");
      expect(circleProgressWrapper.element.getAttribute("stroke-linecap")).to.equal(`${line}`);
    });
  });
  describe("#lineMode", () => {
    describe("#lineMode.mode", () => {
      const progress = 50;
      const size = 200;
      const baseRadius = size / 2;

      describe("#lineMode.mode.normal", () => {
        let thickness = 20;
        let emptyThickness = 10;
        const wrapper = factory({
          progress,
          thickness,
          emptyThickness,
          lineMode: "normal",
          size
        });
        const circleWrapper = wrapper.find(Circle);
        const circleProgressWrapper = circleWrapper.find("circle.ep-circle--progress");
        const circleEmptyWrapper = circleWrapper.find("circle.ep-circle--empty");

        describe("radius of the circles does not exceed the size and aligns properly in relation to each other", () => {
          it("in case #thickness >= #emptyThickness", () => {
            let expectedProgressCircleRadius = baseRadius - thickness / 2;
            let expectedEmptyCircleRadius = expectedProgressCircleRadius;
            compareRadiusValues(circleWrapper, expectedProgressCircleRadius, expectedEmptyCircleRadius);

            thickness = emptyThickness = 10;

            wrapper.setProps({ thickness, emptyThickness });

            expectedProgressCircleRadius = baseRadius - thickness / 2;
            expectedEmptyCircleRadius = expectedProgressCircleRadius;
            compareRadiusValues(circleWrapper, expectedProgressCircleRadius, expectedEmptyCircleRadius);
          });
          it("in case #thickness >= #emptyThickness and #lineMode.offset = 10", () => {
            // offset must be ignored in this mode
            wrapper.setProps({ lineMode: "normal 10" });
            let expectedProgressCircleRadius = baseRadius - thickness / 2;
            let expectedEmptyCircleRadius = expectedProgressCircleRadius;
            compareRadiusValues(circleWrapper, expectedProgressCircleRadius, expectedEmptyCircleRadius);

            thickness = emptyThickness = 10;

            wrapper.setProps({ thickness, emptyThickness });

            expectedProgressCircleRadius = baseRadius - thickness / 2;
            expectedEmptyCircleRadius = expectedProgressCircleRadius;
            compareRadiusValues(circleWrapper, expectedProgressCircleRadius, expectedEmptyCircleRadius);
          });
          it("in case #thickness < #emptyThickness", () => {
            thickness = 10;
            emptyThickness = 20;

            wrapper.setProps({ thickness, emptyThickness });

            const expectedEmptyCircleRadius = baseRadius - emptyThickness / 2;
            const expectedProgressCircleRadius = expectedEmptyCircleRadius;
            compareRadiusValues(circleWrapper, expectedProgressCircleRadius, expectedEmptyCircleRadius);
          });
          it("in case #thickness < #emptyThickness and #lineMode.offset", () => {
            // offset must be ignored in this mode
            thickness = 10;
            emptyThickness = 20;

            wrapper.setProps({ thickness, emptyThickness, lineMode: "normal 10" });

            const expectedEmptyCircleRadius = baseRadius - emptyThickness / 2;
            const expectedProgressCircleRadius = expectedEmptyCircleRadius;
            compareRadiusValues(circleWrapper, expectedProgressCircleRadius, expectedEmptyCircleRadius);
          });
        });
      });
      describe("#lineMode.mode.in", () => {
        const offset = 10;
        const thickness = 20;
        const emptyThickness = 10;
        const wrapper = factory({
          progress,
          thickness,
          emptyThickness,
          lineMode: `in ${offset}`,
          size
        });

        const circleWrapper = wrapper.find(Circle);

        it("circles does not exceed the size and aligns properly in relation to each other", () => {
          const expectedEmptyCircleRadius = baseRadius - emptyThickness / 2;
          const expectedProgressCircleRadius = expectedEmptyCircleRadius - emptyThickness / 2 - thickness / 2 - offset;
          compareRadiusValues(circleWrapper, expectedProgressCircleRadius, expectedEmptyCircleRadius);
        });
      });
      describe("#lineMode.mode.in-over", () => {
        const offset = 10; // must be ignored in this mode
        const thickness = 20;
        const emptyThickness = 10;
        const wrapper = factory({
          progress,
          thickness,
          emptyThickness,
          lineMode: `in ${offset}`,
          size
        });

        const circleWrapper = wrapper.find(Circle);

        it("circles does not exceed the size and aligns properly in relation to each other", () => {
          const expectedEmptyCircleRadius = baseRadius - emptyThickness / 2;
          const expectedProgressCircleRadius = baseRadius - thickness / 2;
          compareRadiusValues(circleWrapper, expectedProgressCircleRadius, expectedEmptyCircleRadius);
        });
      });
      describe("#lineMode.mode.out", () => {
        const offset = 10;
        const thickness = 10;
        const emptyThickness = 10;
        const wrapper = factory({
          progress,
          thickness,
          emptyThickness,
          lineMode: `out ${offset}`,
          size
        });

        const circleWrapper = wrapper.find(Circle);

        it("circles does not exceed the size and aligns properly in relation to each other", () => {
          const expectedProgressCircleRadius = baseRadius - emptyThickness / 2;
          const expectedEmptyCircleRadius = expectedProgressCircleRadius - emptyThickness / 2 - thickness / 2 - offset;
          compareRadiusValues(circleWrapper, expectedProgressCircleRadius, expectedEmptyCircleRadius);
        });
      });
      describe("#lineMode.mode.out-over", () => {
        const offset = 10; // must be ignored in this mode
        let thickness = 20;
        let emptyThickness = 10;
        const wrapper = factory({
          progress,
          thickness,
          emptyThickness,
          lineMode: `out-over ${offset}`,
          size
        });

        const circleWrapper = wrapper.find(Circle);
        const circleProgressWrapper = circleWrapper.find("circle.ep-circle--progress");
        const circleEmptyWrapper = circleWrapper.find("circle.ep-circle--empty");

        describe("radius of the circles does not exceed the size and aligns properly in relation to each other", () => {
          it("in case #thickness >= #emptyThickness", () => {
            let expectedProgressCircleRadius = baseRadius - thickness / 2;
            let expectedEmptyCircleRadius = expectedProgressCircleRadius - thickness / 2 + emptyThickness / 2;
            compareRadiusValues(circleWrapper, expectedProgressCircleRadius, expectedEmptyCircleRadius);

            thickness = emptyThickness = 10;

            wrapper.setProps({ thickness, emptyThickness });

            expectedProgressCircleRadius = baseRadius - thickness / 2;
            expectedEmptyCircleRadius = expectedProgressCircleRadius;
            compareRadiusValues(circleWrapper, expectedProgressCircleRadius, expectedEmptyCircleRadius);
          });
          it("in case #thickness < #emptyThickness", () => {
            thickness = 10;
            emptyThickness = 20;

            wrapper.setProps({ thickness, emptyThickness });

            const expectedEmptyCircleRadius = baseRadius - emptyThickness / 2;
            const expectedProgressCircleRadius = expectedEmptyCircleRadius - emptyThickness / 2 + thickness / 2;
            compareRadiusValues(circleWrapper, expectedProgressCircleRadius, expectedEmptyCircleRadius);
          });
        });
      });
      describe("#lineMode.mode.top", () => {
        const offset = 10; // must be ignored in this mode
        const thickness = 20;
        const emptyThickness = 20;
        const wrapper = factory({
          progress,
          thickness,
          emptyThickness,
          lineMode: `top ${offset}`,
          size
        });

        const circleWrapper = wrapper.find(Circle);

        it("circles does not exceed the size and aligns properly in relation to each other", () => {
          const expectedProgressCircleRadius = baseRadius - thickness / 2;
          const expectedEmptyCircleRadius = expectedProgressCircleRadius - emptyThickness / 2;
          compareRadiusValues(circleWrapper, expectedProgressCircleRadius, expectedEmptyCircleRadius);
        });
      });
      describe("#lineMode.mode.bottom", () => {
        const offset = 10; // must be ignored in this mode
        let thickness = 40;
        let emptyThickness = 10;
        const wrapper = factory({
          progress,
          thickness,
          emptyThickness,
          lineMode: `bottom ${offset}`,
          size
        });

        const circleWrapper = wrapper.find(Circle);

        describe("radius of the circles does not exceed the size and aligns properly in relation to each other", () => {
          it("in case #thickness * 2 > #emptyThickness", () => {
            const expectedProgressCircleRadius = baseRadius - thickness / 2;
            const expectedEmptyCircleRadius = expectedProgressCircleRadius + emptyThickness / 2;
            compareRadiusValues(circleWrapper, expectedProgressCircleRadius, expectedEmptyCircleRadius);
          });
          it("in case #thickness * 2 <= #emptyThickness", () => {
            thickness = 10;
            emptyThickness = 20;

            wrapper.setProps({ thickness, emptyThickness });

            let expectedEmptyCircleRadius = baseRadius - emptyThickness / 2;
            let expectedProgressCircleRadius = expectedEmptyCircleRadius - emptyThickness / 2;
            compareRadiusValues(circleWrapper, expectedProgressCircleRadius, expectedEmptyCircleRadius);

            thickness = emptyThickness = 20;

            wrapper.setProps({ thickness, emptyThickness });

            expectedEmptyCircleRadius = baseRadius - emptyThickness / 2;
            expectedProgressCircleRadius = expectedEmptyCircleRadius - emptyThickness / 2;
            compareRadiusValues(circleWrapper, expectedProgressCircleRadius, expectedEmptyCircleRadius);
          });
        });
      });
    });
  });
};
