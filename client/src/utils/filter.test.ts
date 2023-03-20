import { valueToHz, hzToValue, valueToGain, gainToValue } from "./filters"
import { describe, it, expect } from "vitest"

describe("example functions", () => {
  describe("valueToHz", () => {
    it("should return the minimum frequency for a value of 0", () => {
      expect(valueToHz(0)).toBeCloseTo(20)
    })
    it("should return the maximum frequency for a value of 100", () => {
      expect(valueToHz(100)).toBeCloseTo(20000)
    })
  })

  describe("hzToValue", () => {
    it("should return the minimum value for a frequency of 20", () => {
      expect(hzToValue(20)).toBeCloseTo(0)
    })
    it("should return the maximum value for a frequency of 20000", () => {
      expect(hzToValue(20000)).toBeCloseTo(100)
    })
  })

  describe("valueToGain", () => {
    it("should return the correct gain for a given value within the range", () => {
      expect(valueToGain(50)).toBeCloseTo(0)
    })
    it("should return the minimum gain for a value of 0", () => {
      expect(valueToGain(0)).toBeCloseTo(-1)
    })
    it("should return the maximum gain for a value of 100", () => {
      expect(valueToGain(100)).toBeCloseTo(1)
    })
  })

  describe("gainToValue", () => {
    it("should return the correct value for a given gain within the range", () => {
      expect(gainToValue(0)).toBeCloseTo(50)
    })
    it("should return the minimum value for a gain of -1", () => {
      expect(gainToValue(-1)).toBeCloseTo(0)
    })
    it("should return the maximum value for a gain of 1", () => {
      expect(gainToValue(1)).toBeCloseTo(100)
    })
  })
})
