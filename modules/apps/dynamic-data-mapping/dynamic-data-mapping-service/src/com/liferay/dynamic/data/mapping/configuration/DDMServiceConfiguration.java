/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

package com.liferay.dynamic.data.mapping.configuration;

import aQute.bnd.annotation.metatype.Meta;

/**
 * @author Lino Alves
 */
@Meta.OCD(
	id = "com.liferay.dynamic.data.mapping.configuration.DDMServiceConfiguration",
	name = "Dynamic Data Mapping Service Configuration"
)
public interface DDMServiceConfiguration {

	@Meta.AD(deflt = "true", required = false)
	public boolean autogenerateStructureKey();

	@Meta.AD(deflt = "true", required = false)
	public boolean autogenerateTemplateKey();

	@Meta.AD(
		deflt = "ftl",
		optionLabels = {
			"FreeMarker", "Velocity", "Extensible Stylesheet Language"
		},
		optionValues = {"ftl", "vm", "xls"}, required = false
	)
	public String defaultTemplateLanguage();

}