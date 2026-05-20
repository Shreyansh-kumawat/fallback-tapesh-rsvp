import { useMemo, useRef, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase.js'
import PhoneInput from 'react-phone-number-input'
import { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import './RSVPForm.css'
import countryList from 'react-select-country-list'
import CustomDatePicker from '../components/CustomDatePicker'
import logoHD from '../assets/imgs/logoHD--1.png'
import INDIA_DISTRICTS from '../data/indiaDistricts'

function getFlagEmoji(countryCode) {
  if (!countryCode) return ''
  const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

const ALL_COUNTRIES = countryList().getData().map(c => ({ ...c, flag: getFlagEmoji(c.value) }))

const STEPS = [
  { label: 'Guest Detail',    icon: '👤' },
  { label: 'No. of Guests',   icon: '👥' },
  { label: 'From & To',       icon: '✈️' },
  { label: 'Allergy',         icon: '🌿' },
  { label: 'Anything Else',   icon: '💬' },
  { label: 'Review',          icon: '✅' },
]
const TOTAL = STEPS.length

const emptyAdult = () => ({ name: '', phone: '' })
const emptyChild = () => ({ name: '', age: '' })

const MAPS_LINK = 'https://maps.app.goo.gl/6EnhNqNissXUDHJ59'

function useSvgPlayPause(svgRef) {
  const timerRef = useRef(null)

  const play = useCallback(() => {
    const svg = svgRef.current
    if (!svg) return
    svg.classList.remove('rf-bg-svg--paused')
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      svg.classList.add('rf-bg-svg--paused')
    }, 1000)
  }, [svgRef])

  useEffect(() => {
    const svg = svgRef.current
    if (svg) svg.classList.add('rf-bg-svg--paused')
    const events = ['click', 'keydown', 'input', 'change', 'scroll', 'touchstart']
    events.forEach(ev => document.addEventListener(ev, play, { passive: true }))
    return () => {
      events.forEach(ev => document.removeEventListener(ev, play))
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [play, svgRef])
}

function BgSvg({ svgRef }) {
  return (
    <svg
      ref={svgRef}
      className="rf-bg-svg rf-bg-svg--paused"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 700 400"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <style>{`
        #rBg3_tr {animation: rBg3_tr__tr 12000ms linear infinite normal forwards}
        @keyframes rBg3_tr__tr { 0% {transform: translate(1485.265524px,923.716668px) rotate(107.849898deg)} 100% {transform: translate(1485.265524px,923.716668px) rotate(252.130785deg)}}
        #rBg4_tr {animation: rBg4_tr__tr 12000ms linear infinite normal forwards}
        @keyframes rBg4_tr__tr { 0% {transform: translate(1106.552084px,11.479169px) rotate(-104.755169deg)} 100% {transform: translate(1106.552084px,11.479169px) rotate(-194.755169deg)}}
        #rBg5_tr {animation: rBg5_tr__tr 12000ms linear infinite normal forwards}
        @keyframes rBg5_tr__tr { 0% {transform: translate(77.951956px,316.57267px) rotate(179.858074deg)} 100% {transform: translate(77.951956px,316.57267px) rotate(107.849898deg)}}
        #rBg6_to {animation: rBg6_to__to 12000ms linear infinite normal forwards}
        @keyframes rBg6_to__to { 0% {offset-distance: 0%} 50% {offset-distance: 49.378847%} 100% {offset-distance: 100%}}
        #rBg7_to {animation: rBg7_to__to 12000ms linear infinite normal forwards}
        @keyframes rBg7_to__to { 0% {transform: translate(1625.977098px,922.267927px)} 33.333333% {transform: translate(1567.951321px,818.908093px)} 66.666667% {transform: translate(1427.428392px,987.533986px)} 100% {transform: translate(1625.977098px,922.267927px)}}
        #rBg8_to {animation: rBg8_to__to 12000ms linear infinite normal forwards}
        @keyframes rBg8_to__to { 0% {offset-distance: 0%} 50% {offset-distance: 50.699739%} 100% {offset-distance: 100%}}
        #rBg9_tr {animation: rBg9_tr__tr 12000ms linear infinite normal forwards}
        @keyframes rBg9_tr__tr { 0% {transform: translate(1332.072109px,696.229369px) rotate(179.858074deg)} 100% {transform: translate(1332.072109px,696.229369px) rotate(323.892738deg)}}
        #rBg10_tr {animation: rBg10_tr__tr 12000ms linear infinite normal forwards}
        @keyframes rBg10_tr__tr { 0% {transform: translate(820.871069px,284.144659px) rotate(179.858074deg)} 100% {transform: translate(820.871069px,284.144659px) rotate(-35.842484deg)}}
        #rBg11_tr {animation: rBg11_tr__tr 12000ms linear infinite normal forwards}
        @keyframes rBg11_tr__tr { 0% {transform: translate(762.743219px,965.073357px) rotate(0deg)} 100% {transform: translate(762.743219px,965.073357px) rotate(360deg)}}
        #rBg12_tr {animation: rBg12_tr__tr 12000ms linear infinite normal forwards}
        @keyframes rBg12_tr__tr { 0% {transform: translate(1474.519794px,224.809739px) rotate(390.798193deg)} 100% {transform: translate(1474.519794px,224.809739px) rotate(30.798193deg)}}
        .rf-bg-svg--paused #rBg3_tr,
        .rf-bg-svg--paused #rBg4_tr,
        .rf-bg-svg--paused #rBg5_tr,
        .rf-bg-svg--paused #rBg6_to,
        .rf-bg-svg--paused #rBg7_to,
        .rf-bg-svg--paused #rBg8_to,
        .rf-bg-svg--paused #rBg9_tr,
        .rf-bg-svg--paused #rBg10_tr,
        .rf-bg-svg--paused #rBg11_tr,
        .rf-bg-svg--paused #rBg12_tr {
          animation-play-state: paused;
        }
      `}</style>
      <g transform="matrix(.388384 0 0 0.388384 0.446734-9.821674)": 