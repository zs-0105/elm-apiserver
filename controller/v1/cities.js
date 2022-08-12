'use strict'

const Cities = require('../../models/v1/cities.js')
const {
    pinyin
} = require('pinyin')

const AddressComponent = require('../../prototype/addressComponent')

class CityHandle extends AddressComponent {
    constructor() {
        super()
        this.getCity = this.getCity.bind(this);
        this.search = this.search.bind(this)
        this.getDetailAddress = this.getDetailAddress.bind(this)
    }
    async getCityName(req) {
        try {
            const cityInfo = await this.guessPosition(req)
            console.log(cityInfo)
            // 汉字转换为拼音
            const pinyinArr = pinyin(cityInfo.city, {
                style: pinyin.STYLE_NORMAL,
            });
            let cityName = '';
            pinyinArr.forEach(item => {
                cityName += item[0];
            })
            return cityName;
        } catch (err) {
            console.log(err);
        }
    }
    async getCity(req, res, next) {
        try {
            const type = req.query.type
            let cityInfo
            switch (type) {
                case 'guess':
                    const city = await this.getCityName(req)
                    console.log(city);
                    cityInfo = await Cities.cityGuess(city)
                    break;
                case 'hot':
                    cityInfo = await Cities.cityHot();
                    break;
                case 'group':
                    cityInfo = await Cities.cityGroup();
                    break;
                default:
                    res.json({
                        name: 'ERROR_QUERY_TYPE',
                        message: '参数错误',
                    })
                    return
            }
            res.send(cityInfo);
        } catch (err) {
            res.send({
                name: 'ERROR_DATA',
                message: '获取数据失败',
            });
        }
    }
    async getCityById(req, res, next) {
        const cityid = req.params.id
        if (isNaN(cityid)) {
            res.json({
                name: 'ERROR_PARAM_TYPE',
                message: '参数错误',
            })
            return
        }
        try {
            const cityInfo = await Cities.getCityById(cityid);
            res.send(cityInfo);
        } catch (err) {
            res.send({
                name: 'ERROR_DATA',
                message: '获取数据失败',
            });
        }
    }
    async search(req, res, next) {
        let {
            type = 'search', city_id, keyword
        } = req.query;
        let cityInfo;
        if (!keyword) {
            res.json({
                name: 'ERROR_QUERY_TYPE',
                message: '参数错误',
            })
            return
        } else if (isNaN(city_id)) {
            try {
                const cityName = await this.getCityName(req)
                cityInfo = await Cities.cityGuess(cityName)
                city_id = cityInfo.id
            } catch (err) {
                console.log('搜索地址时，获取定位城失败')
                res.send({
                    name: 'ERROR_GET_POSITION',
                    message: '获取数据失败',
                })
                return
            }
        }
        try {
            if (!cityInfo) {
                cityInfo = await Cities.getCityById(city_id);
            }
            const result = await this.searchPlace(keyword, cityInfo.name, type)
            const cityList = [];
            result.data.forEach((item, index) => {
                cityList.push({
                    name: item.title,
                    address: item.address,
                    latitude: item.location.lat,
                    longitude: item.location.lng,
                    geohash: item.location.lat + ',' + item.location.lng,
                })
            });
            res.send(cityList);
        } catch (err) {
            console.log(err);
            res.send(err)
        }
    }
    async getDetailAddress(req, res) {
        const geohash = req.params.geohash || '';
        if (geohash.indexOf(',') == -1) {
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: '参数错误',
            })
            return;
        }
        if (!geohash) {
            res.send({
                name: 'ERROR_PARAM_TYPE',
                message: '参数错误',
            })
        } else {
            try {
                const [lat, lan] = geohash.split(',')
                const {
                    result
                } = await this.getpois(lat, lan)

                res.json({
                    address: result.address,
                    city: result.address_component.city,
                    geohash: result.location.lat + ',' + result.location.lng,
                    latitude: result.location.lat,
                    longitude: result.location.lng,
                    name: result.formatted_addresses.recommend
                })
            } catch (err) {
                console.log(err);
                res.rend(err)
            }
        }
    }

}
module.exports = new CityHandle()