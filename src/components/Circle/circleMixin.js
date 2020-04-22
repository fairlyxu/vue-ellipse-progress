import { isValidNumber } from "../../utils";
import { animationParser, dashParser, lineModeParser } from "../optionsParser";
import { simplifiedProps } from "../interface";

const wait = (ms = 400) => new Promise(resolve => setTimeout(() => resolve(), ms));

export default {
  name: "CircleMixin",
  props: {
    ...simplifiedProps,
    multiple: {
      type: Boolean,
      required: true
    },
    id: {
      type: Number,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    globalThickness: {
      type: [Number, String],
      required: false,
      default: "5%"
    },
    globalGap: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      isInitialized: false
    };
  },
  computed: {
    computedProgress() {
      return parseFloat(this.progress || 0);
    },
    /* Radius Calculation */
    radius() {
      const { offset } = this.parsedLineMode;

      if (this.multiple) {
        return this.baseRadius - this.previousCirclesThickness;
      }

      switch (this.parsedLineMode.mode) {
        case "normal":
          return this.normalLineModeRadius;
        case "in":
          return this.baseRadius - (this.computedEmptyThickness + offset);
        case "out-over":
          if (this.computedEmptyThickness <= this.computedThickness) {
            return this.baseRadius;
          }
          return this.emptyRadius - this.computedEmptyThickness / 2 + this.computedThickness / 2;
        case "bottom":
          return this.emptyRadius - this.computedEmptyThickness / 2;
        case "top":
          return this.emptyRadius + this.computedEmptyThickness / 2;
        default:
          return this.baseRadius;
      }
    },

    emptyRadius() {
      const { offset } = this.parsedLineMode;

      if (this.multiple) {
        return this.baseRadius - this.previousCirclesThickness;
      }

      switch (this.parsedLineMode.mode) {
        case "normal":
          return this.normalLineModeRadius;
        case "out":
          return this.baseRadius - (this.computedThickness / 2 + this.computedEmptyThickness / 2 + offset);
        case "out-over":
          if (this.computedEmptyThickness <= this.computedThickness) {
            return this.baseRadius - this.computedThickness / 2 + this.computedEmptyThickness / 2;
          }
          return this.emptyBaseRadius;
        case "bottom":
          if (this.computedEmptyThickness < this.computedThickness / 2) {
            return this.emptyBaseRadius - (this.computedThickness / 2 - this.computedEmptyThickness);
          }
          return this.emptyBaseRadius;
        case "top":
          return this.emptyBaseRadius - this.computedThickness / 2;
        default:
          return this.emptyBaseRadius;
      }
    },
    baseRadius() {
      return this.size / 2 - this.computedThickness / 2;
    },
    emptyBaseRadius() {
      return this.size / 2 - this.computedEmptyThickness / 2;
    },
    normalLineModeRadius() {
      if (this.computedThickness < this.computedEmptyThickness) {
        return this.emptyBaseRadius;
      }
      return this.baseRadius;
    },
    parsedLineMode() {
      return lineModeParser(this.lineMode);
    },
    parsedAnimation() {
      return animationParser(this.animation);
    },
    parsedDash() {
      return dashParser(this.dash);
    },
    dataIsAvailable() {
      return isValidNumber(this.computedProgress) && !this.noData;
    },
    animationClass() {
      return [
        `animation__${
          !this.loading && this.dataIsAvailable && this.isInitialized ? this.parsedAnimation.type : "default"
        }`,
        `${this.loading ? "animation__loading" : ""}`
      ];
    },
    /* Colors */
    computedColor() {
      if (this.color.colors) {
        return `url(#ep-progress-gradient-${this.id})`;
      }
      return this.color;
    },
    computedEmptyColor() {
      if (this.emptyColor.colors) {
        return `url(#ep-empty-gradient-${this.id})`;
      }
      return this.emptyColor;
    },
    computedColorFill() {
      if (this.colorFill.colors) {
        return `url(#ep-progress-fill-gradient-${this.id})`;
      }
      return this.colorFill || "transparent";
    },
    computedEmptyColorFill() {
      if (this.emptyColorFill.colors) {
        return `url(#ep-empty-fill-gradient-${this.id})`;
      }
      return this.emptyColorFill || "transparent";
    },
    computedThickness() {
      return this.calculateThickness(this.thickness.toString());
    },
    computedGlobalThickness() {
      return this.calculateThickness(this.globalThickness.toString());
    },
    computedEmptyThickness() {
      return this.calculateThickness(this.emptyThickness.toString());
    },
    animationDuration() {
      return `${this.parsedAnimation.duration}ms`;
    },
    transformOrigin() {
      return "50% 50%";
    },
    emptyDasharray() {
      if (!this.parsedDash.count || !this.parsedDash.spacing) {
        return this.parsedDash;
      }
      return `${2 * Math.PI * this.emptyRadius * this.getDashPercent()},
              ${2 * Math.PI * this.emptyRadius * this.getDashSpacingPercent()}`.trim();
    },
    strokeDashOffset() {
      return this.dataIsAvailable && !this.loading && this.isInitialized ? this.progressOffset : this.circumference;
    },
    previousCirclesThickness() {
      if (this.index === 0) return 0;
      const currentCircleGap = isValidNumber(this.data[this.index].gap) ? this.data[this.index].gap : this.gap;
      const previousCirclesGap = this.data
        .filter((data, i) => i < this.index)
        .map(data => {
          const thickness = isValidNumber(data.thickness) ? data.thickness : this.computedGlobalThickness;
          const gap = isValidNumber(data.gap) ? data.gap : this.globalGap;
          return thickness + gap;
        })
        .reduce((acc, current) => acc + current);
      return previousCirclesGap + currentCircleGap;
    },
    styles() {
      return {
        strokeDashoffset: this.strokeDashOffset,
        transition: this.animationDuration,
        transformOrigin: this.transformOrigin,
        "--ep-circumference": this.circumference,
        "--ep-negative-circumference": this.getNegativeCircumference(),
        "--ep-double-circumference": this.getDoubleCircumference(),
        "--ep-stroke-offset": this.progressOffset,
        "--ep-loop-stroke-offset": this.getLoopOffset(),
        "--ep-bounce-out-stroke-offset": this.getBounceOutOffset(),
        "--ep-bounce-in-stroke-offset": this.getBounceInOffset(),
        "--ep-reverse-stroke-offset": this.getReverseOffset(),
        "--ep-loading-stroke-offset": this.circumference * 0.2,
        "animation-duration": this.animationDuration
      };
    },
    showDeterminate() {
      return this.determinate && !this.loading && this.dataIsAvailable;
    }
  },
  methods: {
    calculateThickness(thickness) {
      const percent = parseFloat(thickness);
      switch (true) {
        case thickness.includes("%"):
          return (percent * this.size) / 100;
        case thickness.includes("rem"): // TODO: Is it worth to implement?
          return (percent * this.size) / 100;
        default:
          return percent;
      }
    },
    getDashSpacingPercent() {
      return this.parsedDash.spacing / this.parsedDash.count;
    },
    getDashPercent() {
      return (1 - this.parsedDash.spacing) / this.parsedDash.count;
    },
    /* Animations helper Methods */
    getNegativeCircumference() {
      return this.circumference * -1;
    },
    getDoubleCircumference() {
      return this.circumference * 2;
    },
    getLoopOffset() {
      return this.getNegativeCircumference() - (this.circumference - this.progressOffset);
    },
    getReverseOffset() {
      return this.getDoubleCircumference() + this.progressOffset;
    },
    getBounceOutOffset() {
      return this.progressOffset < 100 ? 0 : this.progressOffset - 100;
    },
    getBounceInOffset() {
      return this.circumference - this.progressOffset < 100 ? this.progressOffset : this.progressOffset + 100;
    }
  },
  async mounted() {
    if (!this.loading) {
      // await initial delay before applying animations and other props
      await wait(this.parsedAnimation.delay);
    }
    this.isInitialized = true;
  }
};
