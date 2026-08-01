const Shelter = require('../models/Shelter');

exports.getAllShelters = async (req, res) => {
  try {
    const { search, available, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } }
      ];
    }
    if (available === 'true') {
      filter.availableBeds = { $gt: 0 };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [shelters, total] = await Promise.all([
      Shelter.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Shelter.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        shelters,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getShelterById = async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.params.id);
    if (!shelter) {
      return res.status(404).json({ success: false, message: 'Shelter not found.' });
    }
    res.json({ success: true, data: shelter });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createShelter = async (req, res) => {
  try {
    const { name, capacity, availableBeds, location, contact } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required.' });
    }

    const shelter = await Shelter.create({
      name,
      capacity: capacity || 0,
      availableBeds: availableBeds || capacity || 0,
      location: location || { lat: 0, lng: 0, address: '' },
      contact: contact || ''
    });

    res.status(201).json({ success: true, message: 'Shelter created successfully.', data: shelter });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateShelter = async (req, res) => {
  try {
    const allowedFields = ['name', 'capacity', 'availableBeds', 'location', 'contact'];
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const shelter = await Shelter.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!shelter) {
      return res.status(404).json({ success: false, message: 'Shelter not found.' });
    }
    res.json({ success: true, message: 'Shelter updated.', data: shelter });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteShelter = async (req, res) => {
  try {
    const shelter = await Shelter.findByIdAndDelete(req.params.id);
    if (!shelter) {
      return res.status(404).json({ success: false, message: 'Shelter not found.' });
    }
    res.json({ success: true, message: 'Shelter deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getNearbyShelters = async (req, res) => {
  try {
    const { lat, lng, maxDistance } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required.' });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const distance = maxDistance ? parseFloat(maxDistance) : 500;

    const R = 6371;
    const shelters = await Shelter.aggregate([
      {
        $addFields: {
          distance: {
            $multiply: [
              R,
              2,
              {
                $asin: {
                  $sqrt: {
                    $add: [
                      {
                        $pow: [
                          { $sin: { $divide: [{ $multiply: [{ $subtract: ['$location.lat', latitude] }, Math.PI / 180] }, 2] } },
                          2
                        ]
                      },
                      {
                        $multiply: [
                          { $cos: latitude * Math.PI / 180 },
                          { $cos: { $multiply: ['$location.lat', Math.PI / 180] } },
                          {
                            $pow: [
                              { $sin: { $divide: [{ $multiply: [{ $subtract: ['$location.lng', longitude] }, Math.PI / 180] }, 2] } },
                              2
                            ]
                          }
                        ]
                      }
                    ]
                  }
                }
              }
            ]
          }
        }
      },
      { $match: { distance: { $lte: distance } } },
      { $sort: { distance: 1 } }
    ]);

    res.json({ success: true, data: shelters });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
