const User = require('../models/User');
const Rescuer = require('../models/Rescuer');
const Disaster = require('../models/Disaster');
const Shelter = require('../models/Shelter');
const Notification = require('../models/Notification');

const seedData = async () => {
  console.log('Seeding database with mock data...');

  const indianNames = [
    'Aarav Patel', 'Vivaan Sharma', 'Aditya Mehta', 'Vihaan Kumar', 'Arjun Singh',
    'Sai Reddy', 'Reyansh Gupta', 'Ayaan Khan', 'Krishna Joshi', 'Ishaan Verma',
    'Priya Singh', 'Ananya Sharma', 'Diya Patel', 'Saanvi Gupta', 'Myra Joshi',
    'Sara Khan', 'Aadhya Reddy', 'Aarohi Kumar', 'Anvi Mehta', 'Pihu Sharma',
    'Rohit Sharma', 'Amit Kumar', 'Sanjay Patel', 'Ravi Singh', 'Deepak Joshi',
    'Suresh Gupta', 'Mahesh Verma', 'Rajesh Reddy', 'Vikram Khan', 'Sunil Mehta',
    'Neha Patel', 'Riya Sharma', 'Pooja Kumar', 'Kavita Singh', 'Meera Joshi',
    'Sunita Gupta', 'Rekha Verma', 'Geeta Reddy', 'Suman Khan', 'Lata Mehta',
    'Rahul Tiwari', 'Aakash Dubey', 'Manish Pandey', 'Arun Mishra', 'Nitin Saxena',
    'Vikas Pandey', 'Pradeep Srivastava', 'Mukesh Awasthi', 'Ramesh Chandra',
    'Shanti Devi'
  ];

  const indianCities = [
    'Mumbai, Maharashtra', 'Delhi, Delhi', 'Bangalore, Karnataka', 'Hyderabad, Telangana',
    'Ahmedabad, Gujarat', 'Chennai, Tamil Nadu', 'Kolkata, West Bengal', 'Pune, Maharashtra',
    'Jaipur, Rajasthan', 'Lucknow, Uttar Pradesh', 'Kanpur, Uttar Pradesh',
    'Nagpur, Maharashtra', 'Indore, Madhya Pradesh', 'Thane, Maharashtra',
    'Bhopal, Madhya Pradesh', 'Visakhapatnam, Andhra Pradesh', 'Patna, Bihar',
    'Vadodara, Gujarat', 'Ghaziabad, Uttar Pradesh', 'Ludhiana, Punjab',
    'Agra, Uttar Pradesh', 'Nashik, Maharashtra', 'Faridabad, Haryana',
    'Meerut, Uttar Pradesh', 'Rajkot, Gujarat', 'Varanasi, Uttar Pradesh',
    'Srinagar, Jammu and Kashmir', 'Aurangabad, Maharashtra', 'Dhanbad, Jharkhand',
    'Amritsar, Punjab', 'Allahabad, Uttar Pradesh', 'Ranchi, Jharkhand',
    'Howrah, West Bengal', 'Coimbatore, Tamil Nadu', 'Jabalpur, Madhya Pradesh',
    'Gwalior, Madhya Pradesh', 'Vijayawada, Andhra Pradesh', 'Madurai, Tamil Nadu',
    'Chandigarh, Chandigarh', 'Guwahati, Assam', 'Shimla, Himachal Pradesh',
    'Dehradun, Uttarakhand', 'Bhubaneswar, Odisha', 'Raipur, Chhattisgarh',
    'Kochi, Kerala', 'Mysore, Karnataka', 'Mangalore, Karnataka'
  ];

  const phoneNumbers = [
    '+91-9876543210', '+91-9876543211', '+91-9876543212', '+91-9876543213',
    '+91-9876543214', '+91-9876543215', '+91-9876543216', '+91-9876543217',
    '+91-9876543218', '+91-9876543219', '+91-9876543220', '+91-9876543221',
    '+91-9876543222', '+91-9876543223', '+91-9876543224', '+91-9876543225',
    '+91-9876543226', '+91-9876543227', '+91-9876543228', '+91-9876543229',
    '+91-9876543230', '+91-9876543231', '+91-9876543232', '+91-9876543233',
    '+91-9876543234', '+91-9876543235', '+91-9876543236', '+91-9876543237',
    '+91-9876543238', '+91-9876543239', '+91-9876543240', '+91-9876543241',
    '+91-9876543242', '+91-9876543243', '+91-9876543244', '+91-9876543245',
    '+91-9876543246', '+91-9876543247', '+91-9876543248', '+91-9876543249',
    '+91-9876543250', '+91-9876543251', '+91-9876543252', '+91-9876543253',
    '+91-9876543254', '+91-9876543255', '+91-9876543256', '+91-9876543257',
    '+91-9876543258', '+91-9876543259'
  ];

  // Create admin user
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@disaster.com',
    password: 'admin123',
    phone: '+91-9000000000',
    role: 'admin',
    address: 'New Delhi, India',
    status: 'active'
  });

  // Create rescuer users
  const rescuerNames = ['Rajesh Kumar', 'Amit Singh', 'Suresh Yadav', 'Prakash Patel', 'Manoj Tiwari'];
  const rescuerEmails = ['rescuer1@disaster.com', 'rescuer2@disaster.com', 'rescuer3@disaster.com', 'rescuer4@disaster.com', 'rescuer5@disaster.com'];
  const rescuerPhones = ['+91-9111111111', '+91-9222222222', '+91-9333333333', '+91-9444444444', '+91-9555555555'];
  const rescuerAddresses = ['Mumbai, Maharashtra', 'Delhi, Delhi', 'Bangalore, Karnataka', 'Chennai, Tamil Nadu', 'Kolkata, West Bengal'];

  const rescuerUsers = [];
  for (let i = 0; i < 5; i++) {
    const user = await User.create({
      name: rescuerNames[i],
      email: rescuerEmails[i],
      password: 'rescuer123',
      phone: rescuerPhones[i],
      role: 'rescuer',
      address: rescuerAddresses[i],
      status: 'active'
    });
    rescuerUsers.push(user);
  }

  // Create regular users
  const regularUsers = [];
  for (let i = 0; i < 47; i++) {
    const user = await User.create({
      name: indianNames[i],
      email: `user${i + 1}@disaster.com`,
      password: 'user123',
      phone: phoneNumbers[i],
      role: 'user',
      address: indianCities[i],
      status: 'active'
    });
    regularUsers.push(user);
  }

  // Create rescuer profiles
  const rescuerSkills = [
    ['Medical', 'Flood Rescue', 'Swimming'],
    ['Fire Fighting', 'Building Collapse', 'First Aid'],
    ['Earthquake', 'Mountain Rescue', 'Climbing'],
    ['Cyclone Response', 'Boat Operation', 'Flood Rescue'],
    ['Road Accident', 'Medical', 'First Aid']
  ];

  const rescuerLocations = [
    { lat: 19.0760, lng: 72.8777 },
    { lat: 28.6139, lng: 77.2090 },
    { lat: 12.9716, lng: 77.5946 },
    { lat: 13.0827, lng: 80.2707 },
    { lat: 22.5726, lng: 88.3639 }
  ];

  const availabilityOptions = ['Available', 'Busy', 'Offline'];

  const rescuerProfiles = [];
  for (let i = 0; i < 5; i++) {
    const rescuer = await Rescuer.create({
      userId: rescuerUsers[i]._id,
      name: rescuerNames[i],
      email: rescuerEmails[i],
      phone: rescuerPhones[i],
      availability: availabilityOptions[i % 3],
      skills: rescuerSkills[i],
      currentLocation: rescuerLocations[i]
    });
    rescuerProfiles.push(rescuer);
  }

  // Create disasters
  const disasterTypes = ['Flood', 'Fire', 'Earthquake', 'Cyclone', 'Landslide', 'Building Collapse', 'Road Accident'];
  const severities = ['Low', 'Medium', 'High', 'Critical'];
  const statuses = ['Pending', 'Assigned', 'In Progress', 'Rescued', 'Completed'];

  const disasterTitles = {
    'Flood': ['Flash Flood in Residential Area', 'River Overflow Near Village', 'Urban Flooding Due to Heavy Rain', 'Dam Water Release Warning', 'Monsoon Flood Alert'],
    'Fire': ['Warehouse Fire in Industrial Area', 'Residential Building Fire', 'Forest Fire Near Hill Station', 'Market Fire in Old City', 'Factory Fire Emergency'],
    'Earthquake': ['Earthquake Tremors Felt', 'Major Earthquake Reported', 'Aftershocks After Earthquake', 'Building Damage from Quake', 'Seismic Activity Detected'],
    'Cyclone': ['Cyclone Approaching Coast', 'Severe Cyclone Warning', 'Cyclone Making Landfall', 'Post-Cyclone Damage Assessment', 'Cyclone Alert for Coastal Areas'],
    'Landslide': ['Landslide on Mountain Road', 'Hillside Landslide After Rain', 'Major Landslide Blocking Highway', 'Village Affected by Landslide', 'Landslide Risk Zone Alert'],
    'Building Collapse': ['Old Building Collapsed', 'Construction Site Collapse', 'Multi-Story Building Partial Collapse', 'Bridge Collapse Reported', 'School Building Damaged'],
    'Road Accident': ['Multi-Vehicle Highway Accident', 'Bus Accident on Highway', 'Truck Overturned on Road', 'Train Derailment Reported', 'Major Road Accident with Injuries']
  };

  const disasterDescriptions = {
    'Flood': 'Water levels rising rapidly. Multiple houses affected. Residents need immediate evacuation. Emergency boats required for rescue operations.',
    'Fire': 'Large fire spreading quickly. Smoke visible from far. Fire department and ambulances needed urgently. People trapped inside.',
    'Earthquake': 'Strong tremors felt across the region. Several buildings showing cracks. People panicking and running into open areas.',
    'Cyclone': 'High-speed winds causing widespread damage. Trees uprooted, power lines down. People advised to stay indoors.',
    'Landslide': 'Major landslide blocking the main road. Vehicles stranded. Debris covering houses at the base of the hill.',
    'Building Collapse': 'Structure partially collapsed. People may be trapped under rubble. Heavy machinery needed for rescue.',
    'Road Accident': 'Multiple vehicles involved. Injuries reported. Ambulances and traffic police needed immediately.'
  };

  const indianLocations = [
    { lat: 19.0760, lng: 72.8777, address: 'Andheri East, Mumbai, Maharashtra' },
    { lat: 28.6139, lng: 77.2090, address: 'Connaught Place, New Delhi' },
    { lat: 12.9716, lng: 77.5946, address: 'Koramangala, Bangalore, Karnataka' },
    { lat: 17.3850, lng: 78.4867, address: 'Banjara Hills, Hyderabad, Telangana' },
    { lat: 23.0225, lng: 72.5714, address: 'Ashram Road, Ahmedabad, Gujarat' },
    { lat: 13.0827, lng: 80.2707, address: 'T. Nagar, Chennai, Tamil Nadu' },
    { lat: 22.5726, lng: 88.3639, address: 'Park Street, Kolkata, West Bengal' },
    { lat: 18.5204, lng: 73.8567, address: 'FC Road, Pune, Maharashtra' },
    { lat: 26.9124, lng: 75.7873, address: 'MI Road, Jaipur, Rajasthan' },
    { lat: 26.8467, lng: 80.9462, address: 'Hazratganj, Lucknow, Uttar Pradesh' },
    { lat: 21.2514, lng: 81.6296, address: 'Civil Lines, Raipur, Chhattisgarh' },
    { lat: 23.2599, lng: 77.4126, address: 'MP Nagar, Bhopal, Madhya Pradesh' },
    { lat: 17.6868, lng: 83.2185, address: 'RTC Complex, Visakhapatnam, AP' },
    { lat: 25.6093, lng: 85.1376, address: 'Boring Road, Patna, Bihar' },
    { lat: 22.3072, lng: 73.1812, address: 'Alkapuri, Vadodara, Gujarat' },
    { lat: 28.4595, lng: 77.0266, address: 'Sector 18, Noida, UP' },
    { lat: 30.7333, lng: 76.7794, address: 'Sector 17, Chandigarh' },
    { lat: 34.0837, lng: 74.7973, address: 'Lal Chowk, Srinagar, J&K' },
    { lat: 9.9312, lng: 76.2673, address: 'MG Road, Kochi, Kerala' },
    { lat: 15.3173, lng: 75.7139, address: 'Gandhi Chowk, Hubli, Karnataka' }
  ];

  const disasters = [];
  for (let i = 0; i < 100; i++) {
    const type = disasterTypes[i % disasterTypes.length];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const location = indianLocations[i % indianLocations.length];
    const titleOptions = disasterTitles[type];
    const title = titleOptions[Math.floor(Math.random() * titleOptions.length)];
    const userIndex = i % 47;
    const daysAgo = Math.floor(Math.random() * 60);
    const createdDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    let assignedRescuer = null;
    if (status !== 'Pending') {
      assignedRescuer = rescuerProfiles[i % 5]._id;
    }

    disasters.push({
      userId: regularUsers[userIndex]._id,
      title: `${title} - ${location.address.split(',')[0]}`,
      type,
      description: disasterDescriptions[type],
      severity,
      latitude: location.lat + (Math.random() - 0.5) * 0.1,
      longitude: location.lng + (Math.random() - 0.5) * 0.1,
      address: location.address,
      status,
      assignedRescuer,
      peopleAffected: Math.floor(Math.random() * 500) + 1,
      emergencyContact: phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)],
      createdAt: createdDate,
      updatedAt: createdDate
    });
  }
  await Disaster.insertMany(disasters);

  // Create shelters
  const shelterData = [
    { name: 'Mumbai Central Relief Center', capacity: 500, availableBeds: 120, location: { lat: 18.9690, lng: 72.8195, address: 'Mumbai Central, Mumbai, Maharashtra' }, contact: '+91-22-23081000' },
    { name: 'Delhi Municipal Shelter Home', capacity: 800, availableBeds: 350, location: { lat: 28.6280, lng: 77.2190, address: 'ITO, New Delhi, Delhi' }, contact: '+91-11-23384500' },
    { name: 'Bangalore Emergency Camp', capacity: 400, availableBeds: 200, location: { lat: 12.9780, lng: 77.5720, address: 'Majestic, Bangalore, Karnataka' }, contact: '+91-80-22860000' },
    { name: 'Chennai Flood Relief Camp', capacity: 600, availableBeds: 80, location: { lat: 13.0604, lng: 80.2496, address: 'T. Nagar, Chennai, Tamil Nadu' }, contact: '+91-44-28345000' },
    { name: 'Kolkata Disaster Response Center', capacity: 450, availableBeds: 250, location: { lat: 22.5700, lng: 88.3500, address: 'Salt Lake, Kolkata, West Bengal' }, contact: '+91-33-23340000' },
    { name: 'Hyderabad Emergency Shelter', capacity: 350, availableBeds: 180, location: { lat: 17.4065, lng: 78.4691, address: 'Ameerpet, Hyderabad, Telangana' }, contact: '+91-40-23750000' },
    { name: 'Ahmedabad Relief Camp', capacity: 300, availableBeds: 150, location: { lat: 23.0300, lng: 72.5800, address: 'Navrangpura, Ahmedabad, Gujarat' }, contact: '+91-79-26580000' },
    { name: 'Pune Emergency Camp', capacity: 250, availableBeds: 130, location: { lat: 18.5150, lng: 73.8550, address: 'Shivajinagar, Pune, Maharashtra' }, contact: '+91-20-25530000' },
    { name: 'Jaipur Relief Center', capacity: 280, availableBeds: 200, location: { lat: 26.9000, lng: 75.7500, address: 'C-Scheme, Jaipur, Rajasthan' }, contact: '+91-141-2560000' },
    { name: 'Lucknow Emergency Shelter', capacity: 320, availableBeds: 170, location: { lat: 26.8300, lng: 80.9000, address: 'Gomti Nagar, Lucknow, UP' }, contact: '+91-522-2300000' },
    { name: 'Nagpur Disaster Center', capacity: 200, availableBeds: 140, location: { lat: 21.1300, lng: 79.0500, address: 'Dharampeth, Nagpur, Maharashtra' }, contact: '+91-712-2530000' },
    { name: 'Bhopal Relief Camp', capacity: 260, availableBeds: 190, location: { lat: 23.2400, lng: 77.4200, address: 'New Market, Bhopal, MP' }, contact: '+91-755-2550000' },
    { name: 'Visakhapatnam Emergency Camp', capacity: 350, availableBeds: 100, location: { lat: 17.7100, lng: 83.2800, address: 'Dwaraka Nagar, Vizag, AP' }, contact: '+91-891-2540000' },
    { name: 'Kochi Flood Relief Center', capacity: 300, availableBeds: 60, location: { lat: 9.9500, lng: 76.2700, address: 'Ernakulam, Kochi, Kerala' }, contact: '+91-484-2350000' },
    { name: 'Chandigarh Relief Shelter', capacity: 220, availableBeds: 180, location: { lat: 30.7300, lng: 76.7700, address: 'Sector 22, Chandigarh' }, contact: '+91-172-2650000' },
    { name: 'Guwahati Emergency Camp', capacity: 280, availableBeds: 110, location: { lat: 26.1700, lng: 91.7400, address: 'Fancy Bazar, Guwahati, Assam' }, contact: '+91-361-2510000' },
    { name: 'Patna Disaster Response Camp', capacity: 350, availableBeds: 90, location: { lat: 25.6000, lng: 85.1300, address: 'Boring Road, Patna, Bihar' }, contact: '+91-612-2300000' },
    { name: 'Shimla Emergency Shelter', capacity: 150, availableBeds: 100, location: { lat: 31.1000, lng: 77.1700, address: 'Mall Road, Shimla, HP' }, contact: '+91-177-2650000' },
    { name: 'Dehradun Relief Center', capacity: 200, availableBeds: 150, location: { lat: 30.3200, lng: 78.0300, address: 'Clock Tower, Dehradun, UK' }, contact: '+91-135-2650000' },
    { name: 'Raipur Emergency Camp', capacity: 250, availableBeds: 190, location: { lat: 21.2500, lng: 73.1200, address: 'Shankar Nagar, Raipur, CG' }, contact: '+91-771-2530000' }
  ];
  await Shelter.insertMany(shelterData);

  // Create notifications
  const allUserIds = [admin._id, ...rescuerUsers.map(u => u._id), ...regularUsers.slice(0, 30).map(u => u._id)];

  const notifMessages = [
    { title: 'New Disaster Report', message: 'A new disaster has been reported in your area.' },
    { title: 'Rescuer Assigned', message: 'A rescuer has been assigned to your emergency.' },
    { title: 'Status Update', message: 'Your disaster report status has been updated.' },
    { title: 'Emergency Alert', message: 'High severity disaster detected. Stay alert.' },
    { title: 'Shelter Available', message: 'A nearby shelter has availability.' },
    { title: 'Mission Completed', message: 'The rescue mission has been completed successfully.' },
    { title: 'Weather Warning', message: 'Heavy rainfall expected in the next 24 hours.' },
    { title: 'System Update', message: 'System maintenance scheduled for tonight.' },
    { title: 'New Registration', message: 'A new rescuer has been registered.' },
    { title: 'Rescue Update', message: 'Rescue operation is in progress.' }
  ];

  const notifications = [];
  for (let i = 0; i < 60; i++) {
    const notif = notifMessages[i % notifMessages.length];
    const receiverId = allUserIds[i % allUserIds.length];
    const daysAgo = Math.floor(Math.random() * 30);
    notifications.push({
      receiverId,
      title: notif.title,
      message: notif.message,
      isRead: Math.random() > 0.4,
      createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
    });
  }
  await Notification.insertMany(notifications);

  const userCount = await User.countDocuments();
  const rescuerCount = await Rescuer.countDocuments();
  const disasterCount = await Disaster.countDocuments();
  const shelterCount = await Shelter.countDocuments();
  const notifCount = await Notification.countDocuments();

  console.log(`Seeded: ${userCount} users, ${rescuerCount} rescuers, ${disasterCount} disasters, ${shelterCount} shelters, ${notifCount} notifications`);
};

module.exports = seedData;
