import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Target, Eye, Heart, Lightbulb, Users, Award, TrendingUp, MapPin, UserCheck, IndianRupee } from "lucide-react";
import { useEffect, useState } from "react";
import solarFarmImage from '../assets/solarfarm.jpg';

export default function About() {
  const [counterValues, setCounterValues] = useState({
    customers: 0,
    capacity: 0,
    cities: 0,
    savings: 0
  });

  const values = [
    {
      icon: Heart,
      title: "Sustainability",
      description: "Every project contributes to cleaner air and a healthier planet.",
      color: "text-[#F79050]",
      bgColor: "bg-[#F79050]/10"
    },
    {
      icon: Target,
      title: "Transparency ",
      description: "Automated processes ensure clarity in every unit of energy aggregated and exchanged.",
      color: "text-[#28B8B4]",
      bgColor: "bg-[#28B8B4]/10"
    },
    {
      icon: Lightbulb,
      title: "Collaboration ",
      description: " We grow together with our Energy Partners and Energy Subscribers.",
      color: "text-[#2D50A1]",
      bgColor: "bg-[#2D50A1]/10"
    },
    {
      icon: Award,
      title: "Integrity ",
      description: " Compliance, fairness, and ethics guide every decision we make.",
      color: "text-[#09193C]",
      bgColor: "bg-[#09193C]/10"
    },
  ];

  const stats = [
    {
      value: "5000+",
      label: "Happy Customers",
      icon: UserCheck,
      color: "text-[#28B8B4]",
      suffix: "+",
      duration: 2000
    },
    {
      value: "15",
      label: "Installed Capacity",
      icon: TrendingUp,
      color: "text-[#2D50A1]",
      suffix: "MW",
      duration: 2500
    },
    {
      value: "20",
      label: "Cities Served",
      icon: MapPin,
      color: "text-[#09193C]",
      suffix: "+",
      duration: 1500
    },
    {
      value: "500",
      label: "Savings Generated",
      icon: IndianRupee,
      color: "text-[#F79050]",
      suffix: "Cr",
      duration: 3000
    },
  ];

  useEffect(() => {
    const animateCounters = () => {
      const finalValues = {
        customers: 5000,
        capacity: 15,
        cities: 20,
        savings: 500
      };

      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;

        setCounterValues({
          customers: Math.floor(finalValues.customers * progress),
          capacity: Number((finalValues.capacity * progress).toFixed(1)),
          cities: Math.floor(finalValues.cities * progress),
          savings: Math.floor(finalValues.savings * progress)
        });

        if (step >= steps) {
          clearInterval(timer);
        }
      }, stepDuration);
    };

    // Start animation when component mounts
    animateCounters();
  }, []);

  const Counter = ({ value, suffix, color, icon: Icon, label, duration }) => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          duration: 0.5
        }}
        className="text-center group"
      >
        <motion.div
          className="flex flex-col items-center p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-[#28B8B4]/20 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
          whileHover={{ y: -5 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={`p-3 rounded-full ${color} bg-opacity-10 dark:bg-opacity-20 mb-4`}
          >
            <Icon className="w-8 h-8" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className={`text-4xl font-bold ${color} mb-2`}
          >
            {value}{suffix}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 dark:text-gray-300 font-medium text-sm uppercase tracking-wide"
          >
            {label}
          </motion.div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#FFF8F5] dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-20 px-4 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#28B8B4]/10 to-[#2D50A1]/10 dark:from-[#28B8B4]/20 dark:to-[#2D50A1]/20" />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute top-10 right-10 w-20 h-20 bg-[#F79050] rounded-full blur-xl opacity-20"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute bottom-10 left-10 w-16 h-16 bg-[#28B8B4] rounded-full blur-xl opacity-20"
        />

        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#28B8B4] to-[#2D50A1] bg-clip-text text-transparent"
            >
              About NewRa Grids
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
            >
              Leading India's transition to sustainable energy solutions with innovation and reliability
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 w-full">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <Card className="h-full border-0 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-white to-[#28B8B4]/10 dark:from-gray-800 dark:to-[#28B8B4]/20">
                <CardContent className="p-8 relative">
                  <div className="absolute top-6 right-6 w-12 h-12 bg-[#28B8B4]/20 rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-[#28B8B4]" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Our Mission</h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                    To democratize access to clean energy by delivering automated, affordable, and sustainable power solutions and enabling every enterprise to reduce costs, meet RPO norms, and accelerate India’s transition to a carbon-neutral future.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
            >
              <Card className="h-full border-0 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-white to-[#2D50A1]/10 dark:from-gray-800 dark:to-[#2D50A1]/20">
                <CardContent className="p-8 relative">
                  <div className="absolute top-6 right-6 w-12 h-12 bg-[#2D50A1]/20 rounded-full flex items-center justify-center">
                    <Eye className="h-6 w-6 text-[#2D50A1]" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Our Vision</h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                    To become India’s most trusted digital renewable-energy platform, empowering industries and communities to experience energy not as a
                    commodity, but as a shared and automated service that powers growth responsibly.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#28B8B4]/5 to-[#2D50A1]/5 dark:from-[#28B8B4]/10 dark:to-[#2D50A1]/10 w-full">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#28B8B4] to-[#2D50A1] bg-clip-text text-transparent">
              Our Impact in Numbers
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Driving India's energy transformation with measurable results and sustainable impact
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
            {/* Left Side - Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={solarFarmImage}
                  alt="Our Impact Visualization"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09193C]/20 to-transparent"></div>
              </div>
            </motion.div>

            {/* Right Side - Counter Boxes */}
            <div className="w-full lg:w-1/2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Counter
                  value={counterValues.customers}
                  suffix="+"
                  label="Happy Customers"
                  icon={UserCheck}
                  color="text-[#28B8B4]"
                  duration={2000}
                />
                <Counter
                  value={counterValues.capacity}
                  suffix="MW"
                  label="Installed Capacity"
                  icon={TrendingUp}
                  color="text-[#2D50A1]"
                  duration={2500}
                />
                <Counter
                  value={counterValues.cities}
                  suffix="+"
                  label="Cities Served"
                  icon={MapPin}
                  color="text-[#09193C]"
                  duration={1500}
                />
                <Counter
                  value={counterValues.savings}
                  suffix="Cr"
                  label="Savings Generated"
                  icon={IndianRupee}
                  color="text-[#F79050]"
                  duration={3000}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 w-full bg-[#FFF8F5] dark:bg-gray-900">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The principles that guide everything we do at NewRa Grids
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full border border-[#28B8B4]/20 shadow-md rounded-xl hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800">
                  <CardContent className="p-8 text-center">

                    {/* Circular Outline Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="relative mx-auto mb-6"
                    >
                      <div className="w-20 h-20 border-2 border-dashed border-[#28B8B4] rounded-full flex items-center justify-center bg-white dark:bg-gray-800 group-hover:border-solid group-hover:border-[#2D50A1] group-hover:bg-[#28B8B4]/10 transition-all duration-300">
                        <value.icon className={`h-8 w-8 ${value.color} group-hover:scale-110 transition-transform duration-300`} />
                      </div>
                    </motion.div>

                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                      {value.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline/Story Section */}
      <section className="py-16 px-4 bg-[#FFF8F5] dark:bg-gray-900 w-full">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#28B8B4] to-[#2D50A1] bg-clip-text text-transparent">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Building a sustainable future, one installation at a time
            </p>
          </motion.div>

          <div className="space-y-8 relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#28B8B4] to-[#2D50A1] transform -translate-x-1/2 hidden md:block" />

            {[
              {
                year: "2023",
                title: "Foundation",
                description: "Conceptualized NewRa Grids with a vision to simplify renewable-energy access.",
                icon: Target
              },
              {
                year: "2024",
                title: "Key Partnerships",
                description: "Formed key partnerships with solar and wind farms; launched pilot aggregator model.",
                icon: TrendingUp
              },
              {
                year: "2025",
                title: "Smart Energy Platform",
                description: "Developed the NewRa Smart Energy Platform, integrating AI-powered dashboards, automated billing, and carbon-impact analytics.",
                icon: MapPin
              },
              {
                year: "2026",
                title: "Expansion & ESG Integration",
                description: "Expanding to multi-state operations, hybrid solar-wind-storage projects, and ESG reporting integration for all clients.",
                icon: Award
              },
            ].map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
                className="relative"
              >
                <Card className="border border-[#28B8B4]/20 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="hidden md:flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#28B8B4] to-[#2D50A1] rounded-2xl mr-6 text-white font-bold text-lg"
                      >
                        {milestone.year}
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <milestone.icon className="w-6 h-6 text-[#28B8B4] mr-3" />
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{milestone.title}</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{milestone.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}